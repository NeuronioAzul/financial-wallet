<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Public routes
Route::prefix('v1')->group(function () {
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/me', [\App\Http\Controllers\Api\AuthController::class, 'me']);

    // Profile
    Route::get('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'show']);
    Route::put('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'update']);

    // Addresses
    Route::get('/addresses', [\App\Http\Controllers\Api\AddressController::class, 'index']);
    Route::post('/addresses', [\App\Http\Controllers\Api\AddressController::class, 'store']);
    Route::get('/addresses/{address}', [\App\Http\Controllers\Api\AddressController::class, 'show']);
    Route::put('/addresses/{address}', [\App\Http\Controllers\Api\AddressController::class, 'update']);
    Route::delete('/addresses/{address}', [\App\Http\Controllers\Api\AddressController::class, 'destroy']);

    // Documents
    Route::get('/documents', [\App\Http\Controllers\Api\DocumentController::class, 'index']);
    Route::post('/documents', [\App\Http\Controllers\Api\DocumentController::class, 'store']);
    Route::get('/documents/status', [\App\Http\Controllers\Api\DocumentController::class, 'status']);
    Route::get('/documents/{document}', [\App\Http\Controllers\Api\DocumentController::class, 'show']);
    Route::delete('/documents/{document}', [\App\Http\Controllers\Api\DocumentController::class, 'destroy']);

    // Wallets
    Route::get('/wallet', [\App\Http\Controllers\Api\WalletController::class, 'show']);
    Route::get('/wallet/balance', [\App\Http\Controllers\Api\WalletController::class, 'balance']);

    // Transactions
    Route::post('/transactions/deposit', [\App\Http\Controllers\Api\TransactionController::class, 'deposit']);
    Route::post('/transactions/transfer', [\App\Http\Controllers\Api\TransactionController::class, 'transfer']);
    Route::post('/transactions/{id}/reverse', [\App\Http\Controllers\Api\TransactionController::class, 'reverse']);
    Route::get('/transactions', [\App\Http\Controllers\Api\TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [\App\Http\Controllers\Api\TransactionController::class, 'show']);
});
