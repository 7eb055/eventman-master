<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Event;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        try {
            $totalUsers = User::count();
            $totalEvents = Event::count();
            $totalRevenue = class_exists(Order::class) ? Order::sum('total_amount') : 0;
            $activeEvents = Event::where('status', 'active')->count();
            $pendingApprovals = Event::where('status', 'pending')->count();
            $supportTickets = DB::table('support_tickets')->count();
            return response()->json([
                'totalUsers' => $totalUsers,
                'totalEvents' => $totalEvents,
                'totalRevenue' => $totalRevenue,
                'activeEvents' => $activeEvents,
                'pendingApprovals' => $pendingApprovals,
                'supportTickets' => $supportTickets,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function platformUsage()
    {
        try {
            // PostgreSQL compatible month extraction
            $usersByMonth = User::selectRaw('EXTRACT(MONTH FROM created_at) as month, COUNT(*) as users')
                ->groupByRaw('EXTRACT(MONTH FROM created_at)')
                ->get();
            $eventsByMonth = Event::selectRaw('EXTRACT(MONTH FROM created_at) as month, COUNT(*) as events')
                ->groupByRaw('EXTRACT(MONTH FROM created_at)')
                ->get();
            $revenueByMonth = class_exists(Order::class)
                ? Order::selectRaw('EXTRACT(MONTH FROM created_at) as month, SUM(total_amount) as revenue')
                    ->groupByRaw('EXTRACT(MONTH FROM created_at)')
                    ->get()
                : collect();
            return response()->json([
                'usersByMonth' => $usersByMonth,
                'eventsByMonth' => $eventsByMonth,
                'revenueByMonth' => $revenueByMonth,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function roleDistribution()
    {
        try {
            $roles = User::select('role', DB::raw('count(*) as value'))
                ->groupBy('role')->get();
            return response()->json($roles);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function systemActivity()
    {
        try {
            $activities = DB::table('activity_logs')->orderBy('created_at', 'desc')->limit(10)->get();
            return response()->json($activities);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function pendingApprovals()
    {
        try {
            $pending = Event::where('status', 'pending')->get();
            return response()->json($pending);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function systemUsers()
    {
        try {
            $users = User::all();
            return response()->json($users);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
