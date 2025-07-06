<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\GuestMigrationToken;
use App\Models\UserSession;
use App\Services\SmsService;
use App\Services\SocialAuthService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Exception;

use App\Models\OtpCode;

class AuthController extends Controller
{
    use ApiResponses;

    protected $smsService;
    protected $socialAuthService;

    public function __construct(SmsService $smsService, SocialAuthService $socialAuthService)
    {
        $this->smsService = $smsService;
        $this->socialAuthService = $socialAuthService;
    }


    /**
     * Register a new user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        Log::info("Incomming request: " . json_encode($request->all()));

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required_without:phone|nullable|email|unique:users,email',
            'phone' => 'required_without:email|nullable|string|unique:users,phone',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error', 422, $validator->errors());
        }

        try {
            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email || null,
                'phone' => $request->phone || null,
                'password' => Hash::make($request->password),
                'auth_provider' => $request->phone ? 'phone' : 'email',
            ]);

            // Send OTP if phone request is sent
            if ($request->phone) {
                $otpController = new OtpController($this->smsService);
                $otpController->sendOtp($request);
            }

            // Generate token
            $token = $user->createToken('auth_token', ['*'], now()->addDays(100))->plainTextToken;

            // User session creation
            $this->createUserSession($user, $request);

            return $this->success('User registered successfully', [
                'user' => $user,
                'access_token' => $token,
            ], 201);
        } catch (Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage());
            return $this->error('User registration failed', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Login a user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required_without:phone|nullable|email',
            'phone' => 'required_without:email|nullable|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error', 422, $validator->errors());
        }

        // Build requested properties based on the login method
        $credentials = [];
        $field = $request->email ? 'email' : 'phone';
        $credentials[$field] = $request->$field;
        $credentials['password'] = $request->password;

        try {
            // Attempt to authenticate user
            if (!Auth::attempt($credentials)) {
                return $this->error('Invalid credentials', 401);
            }

            // Get user
            $user = $request->user();

            // Remove existing token
            $user->tokens()->delete();

            // Generate token
            $token = $user->createToken('auth_token', ['*'], now()->addDays(100))->plainTextToken;

            // User session creation
            $this->createUserSession($user, $request);

            return $this->success('User logged in successfully', [
                'user' => $user,
                'access_token' => $token,
            ], 200);
        } catch (Exception $e) {
            Log::error('User login failed: ' . $e->getMessage());
            return $this->error('User login failed', 500, ['error' => $e->getMessage()]);
        }
    }


    /**
     * Handle social auth
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function socialLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider' => 'required|string|in:facebook',
            'access_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error', 422, $validator->errors());
        }

        try {
            $userData = $this->verifySocialToken($request->provider, $request->access_token);

            if (!$userData) {
                return $this->error('Invalid social token', 401);
            }

            // FindOrCreate user 
            $user = User::firstOrCreate(
                [
                    'email' => $userData['email'],
                    'auth_provider' => $request->provider,
                ],
                [
                    'name' => $userData['name'],
                    'provider_id' => $userData['id'],
                    'profile_picture' => $userData['picture']['data']['url'] ?? null,
                    'password' => Hash::make(Str::random(24)),
                ]
            );

            // Generate token
            $token = $user->createToken('auth_token', ['*'], now()->addDays(100))->plainTextToken;

            // User session creation
            $this->createUserSession($user, $request);

            return $this->success('User logged in successfully', [
                'user' => $user,
                'access_token' => $token,
            ], 200);
        } catch (Exception $e) {
            Log::error('Social login failed: ' . $e->getMessage());
            return $this->error('Social login failed', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Verify OTP code
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'otp' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error', 422, $validator->errors());
        }

        try {
            // Check if OTP exists
            $otpCode = OtpCode::where('phone', $request->phone)->latest()->first();

            if (!$otpCode) {
                return $this->error('No OTP found', 404);
            }

            if ($otpCode->isExpired()) {
                return $this->error('OTP expired', 400);
            }

            // If too many attempts
            if ($otpCode->hasManyAttempts()) {
                return $this->error('Too many attempts', 429);
            }

            $otpCode->increment('attempts');

            // Verify OTP code
            if ($otpCode->code !== $request->otp) {
                return $this->error('Invalid OTP code', 400);
            }

            // Get user and mark phone as verified
            $user = User::where('phone', $request->phone)->first();
            $user->is_phone_verified = true;
            $user->save();

            // Generate token
            $token = $user->createToken('auth_token', ['*'], now()->addDays(100))->plainTextToken;

            // Create session record
            $this->createUserSession($user, $request);

            return $this->success('OTP verified successfully', [
                'user' => $user,
                'access_token' => $token,
            ], 200);
        } catch (Exception $e) {
            Log::error('OTP verification failed: ' . $e->getMessage());
            return $this->error('OTP verification failed', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Create a guest user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createGuest(Request $request)
    {
        $user = User::create([
            'name' => 'Guest User',
            'auth_provider' => 'guest',
            'is_guest' => true,
            'password' => Hash::make(Str::random(24)),
        ]);

        $token = $user->createToken('guest_token', ['*'], now()->addDays(30))->plainTextToken;

        // Create guest migration token
        $migrationToken = Str::random(64);
        GuestMigrationToken::create([
            'user_id' => $user->id,
            'token' => $migrationToken,
            'expires_at' => now()->addDays(30),
        ]);

        // Create session record
        $this->createUserSession($user, $request);

        return response()->json([
            'message' => 'Guest user created successfully',
            'access_token' => $token,
            'guest_migration_token' => $migrationToken,
        ]);
    }

    /**
     * Convert guest to regular user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function guestToUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guest_migration_token' => 'required|string|exists:guest_migration_tokens,token',
            'name' => 'required|string|max:255',
            'email' => 'required_without:phone|nullable|email|unique:users,email',
            'phone' => 'required_without:email|nullable|string|unique:users,phone',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error', 422, $validator->errors());
        }

        try {
            $migrationToken = GuestMigrationToken::where('token', $request->guest_migration_token)->with('user')->first();

            if (!$migrationToken || $migrationToken->isExpired()) {
                return $this->error('Invalid guest migration token', 400);
            }

            $user = $migrationToken->user;

            if (!$user->is_guest) {
                return $this->error('User is not a guest', 400);
            }

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'auth_provider' => $request->phone ? 'phone' : 'email',
                'is_guest' => false,
            ]);

            $migrationToken->delete();

            // Revoke guest token
            $user->tokens()->where('name', 'guest_token')->delete();
            $token = $user->createToken('auth_token', ['*'], now()->addDays(100))->plainTextToken;

            return $this->success('Guest user converted to regular user successfully', [
                'user' => $user,
                'access_token' => $token,
            ], 200);
        } catch (Exception $e) {
            Log::error('Guest to user conversion failed: ' . $e->getMessage());
            return $this->error('Guest to user conversion failed', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Get current authenticated user
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        return $this->success('Current user retrieved successfully', [
            'user' => $request->user(),
        ], 200);
    }

    /**
     * Logout current user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'User logged out successfully',
        ]);
    }


    /**
     * UTILS functions for auth
     * ------------------------------------------------------------
     */

    /**
     * Create user session record.
     *
     * @param  \App\Models\User
     * @param  \Illuminate\Http\Request 
     * @return void
     */
    private function createUserSession($user, $request)
    {
        UserSession::create([
            'user_id' => $user->id,
            'device_name' => $request->header('User-Agent'),
            'device_type' => $this->getDeviceType($request->header('User-Agent')),
            'device_token' => $request->device_token,
            'ip_address' => $request->ip(),
            'last_active_at' => now(),
        ]);
    }


    /**
     * Get device type from user agent.
     *
     * @param  string  $userAgent
     * @return string|null
     */
    private function getDeviceType($userAgent)
    {
        if (strpos($userAgent, 'Android') !== false) {
            return 'android';
        } elseif (strpos($userAgent, 'iPhone') !== false || strpos($userAgent, 'iPad') !== false) {
            return 'ios';
        }
        return null;
    }


    /**
     * Verify social token
     * 
     * @param string $provider
     * @param string $accessToken
     * @return array|null
     */
    private function verifySocialToken(string $provider, string $accessToken)
    {
        try {
            if ($provider === 'facebook') {
                return $this->socialAuthService->verifyFacebookToken($accessToken);
            }
            return null;
        } catch (Exception $e) {
            Log::error('Social token verification failed: ' . $e->getMessage());
            return null;
        }
    }
}
