<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class ResetAppLock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reset-lock';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Disables the App Lock password in case you are locked out of SimpleDesk.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->warn('This will remove the application password and allow anyone with the URL to access SimpleDesk.');
        
        if ($this->confirm('Are you sure you want to proceed?')) {
            Setting::where('key', 'app_password')->delete();
            Cache::forget('app_password');
            
            $this->info('App Lock has been successfully disabled. You can now access the application without a password.');
            return 0;
        }

        $this->info('Operation cancelled. The app lock password remains active.');
        return 1;
    }
}
