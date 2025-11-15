<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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
