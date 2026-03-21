<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class AppLockMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Don't intercept locked/unlock routes
        if ($request->is('locked') || $request->is('unlock')) {
            return $next($request);
        }

        // Check if app lock is enabled
        $appPassword = Cache::remember('app_password', 60, function () {
            return Setting::where('key', 'app_password')->value('value');
        });

        if ($appPassword && !session('app_unlocked')) {
            return redirect()->route('locked');
        }

        return $next($request);
    }
}
