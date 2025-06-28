<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OtpController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('social', [AuthController::class, 'socialAuth']);
    Route::post('verify', [AuthController::class, 'verifyOtp']);
    Route::post('guest', [AuthController::class, 'createGuest']);
    Route::post('guest-to-user', [AuthController::class, 'guestToUser']);
    Route::post('send-otp', [OtpController::class, 'sendOtp']);
});


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
});
