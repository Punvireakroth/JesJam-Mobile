<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * The SMS API key.
     *
     * @var string
     */
    protected $apiKey;

    /**
     * The SMS sender ID.
     *
     * @var string
     */
    protected $senderId;

    /**
     * Create a new SMS service instance.
     *
     * @param  string  $apiKey
     * @param  string  $senderId
     */
    public function __construct($apiKey, $senderId)
    {
        $this->apiKey = $apiKey;
        $this->senderId = $senderId;
    }

    /**
     * Send an SMS message.
     *
     * @param  string  $phone
     * @param  string  $message
     * @return bool
     */
    public function send($phone, $message)
    {
        // Development purpose
        if (app()->environment('local', 'development')) {
            Log::info("SMS to {$phone}: {$message}");
            return true;
        }

        try {
            // TODO: In production, integrate with a real SMS provider like Twilio, Vonage, etc.
            // Example with a generic API:

            /*
            $client = new \GuzzleHttp\Client();
            $response = $client->post('https://sms-provider.com/api/send', [
                'form_params' => [
                    'api_key' => $this->apiKey,
                    'sender_id' => $this->senderId,
                    'phone' => $phone,
                    'message' => $message,
                ],
            ]);

            return $response->getStatusCode() === 200;
            */

            // For now, just log the message
            Log::info("SMS to {$phone}: {$message}");
            return true;
        } catch (\Exception $e) {
            Log::error('SMS sending error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send an OTP code.
     *
     * @param  string  $phone
     * @param  string  $code
     * @return bool
     */
    public function sendOtp($phone, $code)
    {
        $message = "Your JesJam verification code is {$code}. This code will expire in 5 minutes.";
        return $this->send($phone, $message);
    }
}
