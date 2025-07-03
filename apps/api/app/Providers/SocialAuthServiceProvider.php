<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SocialAuthService;

class SocialAuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(SocialAuthService::class, function ($app) {
            return new SocialAuthService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
