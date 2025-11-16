<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Services\ProfileService;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function __construct(private ProfileService $profileService) {}

    public function show(): JsonResponse
    {
        $profile = $this->profileService->getProfile(auth()->user());

        return response()->json([
            'message' => 'Profile retrieved successfully',
            'data' => $profile,
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->profileService->updateProfile(
            auth()->user(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user,
        ]);
    }
}
