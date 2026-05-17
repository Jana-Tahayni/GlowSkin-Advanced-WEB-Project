<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $admin = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'name'  => $admin->first_name . ' ' . $admin->last_name,
                'email' => $admin->email,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $admin = $request->user();

        $validated = $request->validate([
            'name'  => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $admin->id,
        ]);

       
        $parts = explode(' ', trim($validated['name']), 2);
        $admin->first_name = $parts[0];
        $admin->last_name  = $parts[1] ?? '';
        $admin->email      = $validated['email'];
        $admin->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data'    => [
                'name'  => $admin->first_name . ' ' . $admin->last_name,
                'email' => $admin->email,
            ],
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $admin = $request->user();

        $request->validate([
            'currentPassword' => 'required|string',
            'newPassword'     => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->currentPassword, $admin->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['Current password is incorrect.'],
            ]);
        }

        $admin->password = Hash::make($request->newPassword);
        $admin->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
        ]);
    }
}