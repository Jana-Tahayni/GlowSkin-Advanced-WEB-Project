<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use Illuminate\Support\Facades\Auth;
class NotificationController extends Controller
{
    #[OA\Get(
        path: "/api/notifications",
        summary: "Get all notifications for the user",
        tags: ["Notifications"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of notifications",
                content: new OA\JsonContent(type: "array", items: new OA\Items())
            )
        ]
    )]
    public function index()
    {

        $user = Auth::guard('api')->user();

        if ($user) {
            return response()->json($user->notifications);
        }
        return response()->json([], 401);
    }

    #[OA\Post(
        path: "/api/notifications/{id}/read",
        summary: "Mark a specific notification as read",
        tags: ["Notifications"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "The ID of the notification",
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Notification marked as read",
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: "success", type: "boolean", example: true)
                ])
            ),
            new OA\Response(response: 404, description: "Notification not found")
        ]
    )]
    public function markAsRead($id)
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            return response()->json(['success' => false], 404);
        }

        $notification = $user->notifications()->where('id', $id)->first();
        //
        // $notification = auth()->user()->notifications()->find($id);

        if($notification) {
            $notification->markAsRead();
            $notification->update(['read_at' => now()]);
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
    }

    #[OA\Post(
        path: "/api/notifications/read-all",
        summary: "Mark all unread notifications as read",
        tags: ["Notifications"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "All notifications marked as read",
                content: new OA\JsonContent(properties: [
                    new OA\Property(property: "success", type: "boolean", example: true)
                ])
            ),
            new OA\Response(response: 404, description: "User not found")
        ]
    )]
    public function markAllRead() {

        $user = Auth::guard('api')->user();

        if (!$user) {
            return response()->json(['success' => false], 401);
        }

        $user->unreadNotifications->markAsRead();
        return response()->json(['success' => true]);
}
}
