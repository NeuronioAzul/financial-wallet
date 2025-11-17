<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Enums\TransactionStatus;
use App\Enums\TransactionType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionReversalTest extends TestCase
{
    use RefreshDatabase;

    protected User $sender;
    protected User $receiver;
    protected Wallet $senderWallet;
    protected Wallet $receiverWallet;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sender = User::factory()->create();
        $this->receiver = User::factory()->create();

        $this->senderWallet = Wallet::factory()->create([
            'user_id' => $this->sender->id,
            'balance' => '1000.00',
        ]);

        $this->receiverWallet = Wallet::factory()->create([
            'user_id' => $this->receiver->id,
            'balance' => '500.00',
        ]);
    }

    public function test_sender_can_reverse_a_transfer_they_sent(): void
    {
        $transaction = Transaction::factory()->create([
            'type' => TransactionType::TRANSFER,
            'amount' => '100.00',
            'status' => TransactionStatus::COMPLETED,
            'sender_user_id' => $this->sender->id,
            'receiver_user_id' => $this->receiver->id,
            'sender_wallet_id' => $this->senderWallet->id,
            'receiver_wallet_id' => $this->receiverWallet->id,
        ]);

        $response = $this->actingAs($this->sender)->postJson("/api/v1/transactions/{$transaction->id}/reverse", [
            'reason' => 'Transferência realizada por engano',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => [
                'reversal_transaction_id',
                'reversal_transaction_code',
                'original_transaction_id',
                'amount',
                'status',
            ],
        ]);

        $reversalTransaction = Transaction::find($response->json('data.reversal_transaction_id'));
        $this->assertStringContainsString('Estorno solicitado pelo remetente', $reversalTransaction->reversal_reason);
    }

    public function test_receiver_can_reverse_a_transfer_they_received(): void
    {
        $transaction = Transaction::factory()->create([
            'type' => TransactionType::TRANSFER,
            'amount' => '100.00',
            'status' => TransactionStatus::COMPLETED,
            'sender_user_id' => $this->sender->id,
            'receiver_user_id' => $this->receiver->id,
            'sender_wallet_id' => $this->senderWallet->id,
            'receiver_wallet_id' => $this->receiverWallet->id,
        ]);

        $response = $this->actingAs($this->receiver)->postJson("/api/v1/transactions/{$transaction->id}/reverse", [
            'reason' => 'Não reconheço esta transferência',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => [
                'reversal_transaction_id',
                'reversal_transaction_code',
                'original_transaction_id',
                'amount',
                'status',
            ],
        ]);

        $reversalTransaction = Transaction::find($response->json('data.reversal_transaction_id'));
        $this->assertStringContainsString('Devolução solicitada pelo destinatário', $reversalTransaction->reversal_reason);
    }

    public function test_unauthorized_user_cannot_reverse_a_transaction(): void
    {
        $otherUser = User::factory()->create();
        Wallet::factory()->create(['user_id' => $otherUser->id]);

        $transaction = Transaction::factory()->create([

            'type' => TransactionType::TRANSFER,
            'amount' => '100.00',
            'status' => TransactionStatus::COMPLETED,
            'sender_user_id' => $this->sender->id,
            'receiver_user_id' => $this->receiver->id,
            'receiver_wallet_id' => $this->receiverWallet->id,
        ]);

        $response = $this->actingAs($otherUser)->postJson("/api/v1/transactions/{$transaction->id}/reverse", [
            'reason' => 'Tentativa de reversão não autorizada',
        ]);

        $response->assertNotFound();
    }

    public function test_sender_cannot_reverse_non_transfer_transaction(): void
    {
        $deposit = Transaction::factory()->create([

            'type' => TransactionType::DEPOSIT,
            'amount' => '100.00',
            'status' => TransactionStatus::COMPLETED,
            'sender_user_id' => $this->sender->id,
        ]);

        $response = $this->actingAs($this->sender)->postJson("/api/v1/transactions/{$deposit->id}/reverse", [
            'reason' => 'Tentando estornar depósito',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'message' => 'You cannot reverse this transaction',
        ]);
    }

    public function test_model_method_can_be_reversed_by_sender_validates_correctly(): void
    {
        $transaction = Transaction::factory()->create([
            'type' => TransactionType::TRANSFER,
            'amount' => '100.00',
            'status' => TransactionStatus::COMPLETED,
            'sender_user_id' => $this->sender->id,
            'receiver_user_id' => $this->receiver->id,
            'sender_wallet_id' => $this->senderWallet->id,
            'receiver_wallet_id' => $this->receiverWallet->id,
        ]);

        $this->assertTrue($transaction->canBeReversedBySender($this->sender->id));
        $this->assertFalse($transaction->canBeReversedBySender($this->receiver->id));
    }

    public function test_model_method_can_be_reversed_by_receiver_validates_correctly(): void
    {
        $transaction = Transaction::factory()->create([
            'type' => TransactionType::TRANSFER,
            'amount' => '100.00',
            'status' => TransactionStatus::COMPLETED,
            'sender_user_id' => $this->sender->id,
            'receiver_user_id' => $this->receiver->id,
            'sender_wallet_id' => $this->senderWallet->id,
            'receiver_wallet_id' => $this->receiverWallet->id,
        ]);

        $this->assertTrue($transaction->canBeReversedByReceiver($this->receiver->id));
        $this->assertFalse($transaction->canBeReversedByReceiver($this->sender->id));
    }

    public function test_deposit_cannot_be_reversed_by_sender(): void
    {
        $deposit = Transaction::factory()->create([
            'type' => TransactionType::DEPOSIT,
            'amount' => '100.00',
            'status' => TransactionStatus::COMPLETED,
            'sender_user_id' => $this->sender->id,
            'sender_wallet_id' => $this->senderWallet->id,
        ]);

        $this->assertFalse($deposit->canBeReversedBySender($this->sender->id));
    }
}
