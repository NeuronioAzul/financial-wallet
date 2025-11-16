<?php

namespace App\Services;

use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Collection;

class AddressService
{
    public function createAddress(User $user, array $data): Address
    {
        // Se marcar como principal, desmarcar outros
        if ($data['is_primary'] ?? false) {
            $user->addresses()->update(['is_primary' => false]);
        }

        $data['user_id'] = $user->id;

        return Address::create($data);
    }

    public function updateAddress(Address $address, array $data): Address
    {
        // Se marcar como principal, desmarcar outros do mesmo usuário
        if (($data['is_primary'] ?? false) && ! $address->is_primary) {
            $address->user->addresses()->update(['is_primary' => false]);
        }

        $address->update($data);
        $address->refresh();

        return $address;
    }

    public function deleteAddress(Address $address): bool
    {
        return $address->delete();
    }

    public function getUserAddresses(User $user): Collection
    {
        return $user->addresses()->orderBy('is_primary', 'desc')->get();
    }
}
