<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'upcomingDeadlines' => fn () => \App\Models\Ticket::whereIn('status', ['open', 'in_progress'])
                ->where('is_archived', false)
                ->whereBetween('deadline_at', [now()->startOfDay(), now()->addDay()->endOfDay()])
                ->get(['id', 'title', 'deadline_at'])
                ->map(fn($t) => [
                    'id' => $t->id,
                    'title' => $t->title,
                    'is_today' => \Carbon\Carbon::parse($t->deadline_at)->isToday(),
                    'is_tomorrow' => \Carbon\Carbon::parse($t->deadline_at)->isTomorrow(),
                ]),
        ];
    }
}
