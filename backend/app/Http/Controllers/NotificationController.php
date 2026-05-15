<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {

        $user = \App\Models\User::where('role', 'user')->first();

        if ($user) {
            return response()->json($user->notifications);
        }

        return response()->json([]);
        // return response()->json(auth()->user()->notifications);
        // return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        //
        $user = \App\Models\User::where('role', 'user')->first();

        if (!$user) {
            return response()->json(['success' => false], 404);
        }

        // $notification = $user->notifications()->find($id);
        $notification = $user->notifications()->where('id', $id)->first();
        //
        // $notification = auth()->user()->notifications()->find($id);

        if($notification) {
            // $notification->markAsRead();
            $notification->update(['read_at' => now()]);
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
    }
    public function markAllRead() {

        $user = \App\Models\User::where('role', 'user')->first();

        if (!$user) {
            return response()->json(['success' => false], 404);
        }

        $user->unreadNotifications->markAsRead();
        return response()->json(['success' => true]);
}
}
