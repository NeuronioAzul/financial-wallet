<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use App\Services\AddressService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;

class AddressController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private AddressService $addressService)
    {
    }

    public function index(): JsonResponse
    {
        $addresses = $this->addressService->getUserAddresses(auth()->user());

        return response()->json([
            'message' => 'Addresses retrieved successfully',
            'data' => $addresses,
        ]);
    }

    public function store(StoreAddressRequest $request): JsonResponse
    {
        $address = $this->addressService->createAddress(
            auth()->user(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Address created successfully',
            'data' => $address,
        ], 201);
    }

    public function show(Address $address): JsonResponse
    {
        $this->authorize('view', $address);

        return response()->json([
            'message' => 'Address retrieved successfully',
            'data' => $address,
        ]);
    }

    public function update(UpdateAddressRequest $request, Address $address): JsonResponse
    {
        $this->authorize('update', $address);

        $address = $this->addressService->updateAddress(
            $address,
            $request->validated()
        );

        return response()->json([
            'message' => 'Address updated successfully',
            'data' => $address,
        ]);
    }

    public function destroy(Address $address): JsonResponse
    {
        $this->authorize('delete', $address);

        $this->addressService->deleteAddress($address);

        return response()->json([
            'message' => 'Address deleted successfully',
        ]);
    }
}
