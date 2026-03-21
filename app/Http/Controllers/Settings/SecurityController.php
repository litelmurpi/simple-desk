<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SecurityController extends Controller
{
    public function index()
    {
        $isAppLockEnabled = Setting::where('key', 'app_password')->exists();
        
        return Inertia::render('Settings/Security', [
            'isAppLockEnabled' => $isAppLockEnabled
        ]);
    }

    public function locked()
    {
        // If not actually locked, redirect to dashboard
        $appPassword = Setting::where('key', 'app_password')->value('value');
        if (!$appPassword || session('app_unlocked')) {
            return redirect()->route('dashboard');
        }
        
        return Inertia::render('Locked');
    }

    public function unlock(Request $request)
    {
        $request->validate(['password' => 'required|string']);
        
        $appPassword = Setting::where('key', 'app_password')->value('value');
        
        if ($appPassword && Hash::check($request->password, $appPassword)) {
            session(['app_unlocked' => true]);
            return redirect()->intended(route('dashboard'));
        }
        
        return back()->withErrors(['password' => 'Incorrect password.']);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'enabled' => 'required|boolean',
            'current_password' => 'nullable|string',
            'new_password' => 'required_if:enabled,true|nullable|string|min:4'
        ]);

        $appPasswordSetting = Setting::where('key', 'app_password')->first();
        
        // Disabling
        if (!$request->enabled) {
            if ($appPasswordSetting) {
                if (!$request->filled('current_password') || !Hash::check($request->current_password, $appPasswordSetting->value)) {
                    return back()->withErrors(['current_password' => 'Current password is required and must match to disable app lock.']);
                }
                $appPasswordSetting->delete();
                Cache::forget('app_password');
                session()->forget('app_unlocked');
            }
            return back()->with('success', 'App Lock disabled.');
        }

        // Enabling / Updating
        if ($appPasswordSetting && $request->filled('current_password')) {
            if (!Hash::check($request->current_password, $appPasswordSetting->value)) {
                return back()->withErrors(['current_password' => 'Current password does not match.']);
            }
        }

        Setting::updateOrCreate(
            ['key' => 'app_password'],
            ['value' => Hash::make($request->new_password)]
        );
        Cache::forget('app_password');

        return back()->with('success', 'App Lock enabled and password saved.');
    }
}
