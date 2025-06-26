<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('phone', 20)->nullable()->unique()->after('email');
            $table->boolean('is_phone_verified')->default(false)->after('email_verified_at');

            $table->enum('auth_provider', ['email', 'phone', 'facebook', 'guest'])
                ->default('email')->after('remember_token');
            $table->string('provider_id')->nullable()->after('auth_provider');

            $table->boolean('is_guest')->default(false)->after('provider_id');

            // Preference fields
            $table->string('profile_picture')->nullable()->after('is_guest');
            $table->enum('preferred_language', ['km', 'en'])->default('km')->after('profile_picture');
            $table->enum('preferred_font_size', ['small', 'medium', 'large'])->default('medium')->after('preferred_language');
            $table->boolean('dark_mode')->default(false)->after('preferred_font_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->dropColumn([
                'phone',
                'is_phone_verified',
                'auth_provider',
                'provider_id',
                'is_guest',
                'profile_picture',
                'preferred_language',
                'preferred_font_size',
                'dark_mode'
            ]);
        });
    }
};
