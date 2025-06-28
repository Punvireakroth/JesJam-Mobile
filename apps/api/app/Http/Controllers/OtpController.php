<?php

namespace App\Http\Controllers;

use App\Models\OtpCode;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class OtpController extends Controller
{
    use ApiResponses;
    /**
     * Send OTP code
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->error('Validation Error', 422, $validator->errors());
        }

        // Check if code is sent too frequently (rate limiting)
        $recentCodes = OtpCode::where('phone', $request->phone)
            ->where('created_at', '>=', now()->subMinutes(15))
            ->count();

        if ($recentCodes >= 3) {
            return $this->error('Too many OTP requests. Please try again later.', 429);
        }

        // Generate OTP code
        $code = sprintf('%06d', random_int(0, 999999));

        // Save OTP to database
        OtpCode::create([
            'phone' => $request->phone,
            'code' => $code,
            'expires_at' => now()->addMinutes(5),
        ]);

        // TODO: Send OTP code via SMS service
        Log::info('OTP code sent to ' . $request->phone . ': ' . $code);

        return $this->success('OTP code sent successfully', [
            'phone' => $request->phone,
        ], 200);
    }
}
