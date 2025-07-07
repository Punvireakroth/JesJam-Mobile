<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SocialAuthService
{
    /**
     * The HTTP client instance.
     *
     * @var \GuzzleHttp\Client
     */
    protected $client;

    /**
     * Create a new social auth service instance.
     */
    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 10,
            'http_errors' => false,
        ]);
    }

    /**
     * Verify a Facebook access token.
     *
     * @param  string  $token
     * @return array|null
     */
    public function verifyFacebookToken($token)
    {
        try {
            // Verify token
            $appId = config('services.facebook.client_id');
            $appSecret = config('services.facebook.client_secret');

            $response = $this->client->get('https://graph.facebook.com/debug_token', [
                'query' => [
                    'input_token' => $token,
                    'access_token' => "{$appId}|{$appSecret}"
                ]
            ]);

            if ($response->getStatusCode() !== 200) {
                return null;
            }

            $data = json_decode($response->getBody(), true);

            if (!isset($data['data']['is_valid']) || !$data['data']['is_valid']) {
                return null;
            }

            // TODO: In production, validate app ID matches
            // if ($data['data']['app_id'] !== $appId) {
            //     return null;
            // }

            // Get user profile info
            $profileResponse = $this->client->get('https://graph.facebook.com/me', [
                'query' => [
                    'fields' => 'id,name,email,picture',
                    'access_token' => $token
                ]
            ]);

            if ($profileResponse->getStatusCode() !== 200) {
                return null;
            }

            $profile = json_decode($profileResponse->getBody(), true);

            return [
                'id' => $profile['id'],
                'email' => $profile['email'] ?? null,
                'name' => $profile['name'],
                'picture' => $profile['picture']['data']['url'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('Facebook auth error: ' . $e->getMessage());
            return null;
        }
    }
}
