<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class GeneralSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index');
    }
}
