<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function updateProfile(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        $user->refresh();

        return $user;
    }

    public function getProfile(User $user): array
    {
        $user->load(['addresses', 'documents', 'wallet']);

        return [
            'user' => $user,
            'addresses' => $user->addresses,
            'documents' => $user->documents->map(fn ($doc) => [
                'id' => $doc->id,
                'document_type' => $doc->document_type->value,
                'document_type_label' => $doc->document_type->label(),
                'status' => $doc->status->value,
                'status_label' => $doc->status->label(),
                'verified_at' => $doc->verified_at,
                'rejection_reason' => $doc->rejection_reason,
                'created_at' => $doc->created_at,
            ]),
            'wallet' => $user->wallet,
        ];
    }
}
