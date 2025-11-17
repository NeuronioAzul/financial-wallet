<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * List all users with their wallets.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('wallet');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name, email or document
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('document', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    /**
     * Show specific user details.
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['wallet', 'addresses', 'documents']);

        return response()->json($user);
    }

    /**
     * Suspend user account.
     */
    public function suspend(User $user): JsonResponse
    {
        if ($user->hasRole('admin')) {
            return response()->json([
                'message' => 'Não é possível suspender um administrador.'
            ], 403);
        }

        $user->update(['status' => UserStatus::BLOCKED]);

        // Optionally suspend wallet too
        if ($user->wallet) {
            $user->wallet->update(['status' => 'suspended']);
        }

        return response()->json([
            'message' => 'Usuário suspenso com sucesso.',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Activate user account.
     */
    public function activate(User $user): JsonResponse
    {
        $user->update(['status' => UserStatus::ACTIVE]);

        // Reactivate wallet too
        if ($user->wallet) {
            $user->wallet->update(['status' => 'active']);
        }

        return response()->json([
            'message' => 'Usuário ativado com sucesso.',
            'user' => $user->fresh()
        ]);
    }
}
