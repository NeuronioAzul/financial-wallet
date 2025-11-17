<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Configura storage fake para testes
        Storage::fake('local');

        // Cria usuário autenticado para os testes
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    public function test_user_can_upload_photo_document(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'document_type',
                    'file_name',
                    'mime_type',
                    'size',
                    'status',
                    'created_at',
                ],
            ])
            ->assertJson([
                'data' => [
                    'document_type' => 'photo',
                    'status' => 'pending',
                ],
            ]);

        $this->assertDatabaseHas('user_documents', [
            'user_id' => $this->user->id,
            'document_type' => 'photo',
            'status' => 'pending',
        ]);
    }

    public function test_document_upload_requires_authentication(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->postJson('/api/v1/documents', [
            'type' => 'photo',
            'file' => $file,
        ]);

        $response->assertStatus(401);
    }

    public function test_document_upload_requires_document_type(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'file' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_document_upload_requires_valid_document_type(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'invalid_type',
                'file' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_document_upload_requires_file(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_document_upload_accepts_jpg_format(): void
    {
        $file = UploadedFile::fake()->image('document.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'rg_front',
                'file' => $file,
            ]);

        $response->assertStatus(201);
    }

    public function test_document_upload_accepts_jpeg_format(): void
    {
        $file = UploadedFile::fake()->image('document.jpeg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'rg_front',
                'file' => $file,
            ]);

        $response->assertStatus(201);
    }

    public function test_document_upload_accepts_png_format(): void
    {
        $file = UploadedFile::fake()->image('document.png');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'rg_front',
                'file' => $file,
            ]);

        $response->assertStatus(201);
    }

    public function test_document_upload_accepts_pdf_format(): void
    {
        $file = UploadedFile::fake()->create('document.pdf', 1024, 'application/pdf');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'rg_front',
                'file' => $file,
            ]);

        $response->assertStatus(201);
    }

    public function test_document_upload_rejects_invalid_file_format(): void
    {
        $file = UploadedFile::fake()->create('document.txt', 1024, 'text/plain');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_document_upload_rejects_file_larger_than_5mb(): void
    {
        $file = UploadedFile::fake()->create('large.jpg', 6000); // 6MB

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_user_can_upload_rg_front(): void
    {
        $file = UploadedFile::fake()->image('rg_front.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'rg_front',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'document_type' => 'rg_front',
                ],
            ]);
    }

    public function test_user_can_upload_rg_back(): void
    {
        $file = UploadedFile::fake()->image('rg_back.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'rg_back',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'document_type' => 'rg_back',
                ],
            ]);
    }

    public function test_user_can_upload_cnh_front(): void
    {
        $file = UploadedFile::fake()->image('cnh_front.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'cnh_front',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'document_type' => 'cnh_front',
                ],
            ]);
    }

    public function test_user_can_upload_cnh_back(): void
    {
        $file = UploadedFile::fake()->image('cnh_back.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'cnh_back',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'document_type' => 'cnh_back',
                ],
            ]);
    }

    public function test_user_can_list_their_documents(): void
    {
        UserDocument::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/documents');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'document_type', 'status', 'created_at'],
                ],
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_view_specific_document(): void
    {
        $document = UserDocument::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/documents/{$document->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $document->id,
                    'document_type' => $document->document_type->value,
                    'status' => $document->status->value,
                ],
            ]);
    }

    public function test_user_cannot_view_other_users_document(): void
    {
        $otherUser = User::factory()->create();
        $document = UserDocument::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/documents/{$document->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_delete_their_document(): void
    {
        $document = UserDocument::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->deleteJson("/api/v1/documents/{$document->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('user_documents', [
            'id' => $document->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_document(): void
    {
        $otherUser = User::factory()->create();
        $document = UserDocument::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->deleteJson("/api/v1/documents/{$document->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('user_documents', [
            'id' => $document->id,
        ]);
    }

    public function test_user_can_check_documents_status(): void
    {
        UserDocument::factory()->create([
            'user_id' => $this->user->id,
            'document_type' => 'photo',
            'status' => 'approved',
        ]);

        UserDocument::factory()->create([
            'user_id' => $this->user->id,
            'document_type' => 'rg_front',
            'status' => 'pending',
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/documents/status');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'has_photo',
                    'has_rg',
                    'has_cnh',
                    'is_complete',
                    'all_approved',
                    'has_rejected',
                    'has_pending',
                    'verification_status',
                ],
            ]);
    }

    public function test_uploaded_document_has_pending_status_by_default(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'status' => 'pending',
                ],
            ]);
    }

    public function test_document_file_is_stored_in_user_directory(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        // Verifica que o arquivo foi armazenado
        $document = UserDocument::where('user_id', $this->user->id)->first();
        $this->assertNotNull($document);
        Storage::disk('local')->assertExists($document->file_path);
    }

    // TODO: Implementar validação de documento duplicado no backend
    // public function test_user_cannot_upload_duplicate_document_type(): void
    // {
    //     // Primeiro upload
    //     $file1 = UploadedFile::fake()->image('photo1.jpg');
    //     $this->withToken($this->token)
    //         ->postJson('/api/v1/documents', [
    //             'type' => 'photo',
    //             'file' => $file1,
    //         ]);

    //     // Tentativa de upload duplicado
    //     $file2 = UploadedFile::fake()->image('photo2.jpg');
    //     $response = $this->withToken($this->token)
    //         ->postJson('/api/v1/documents', [
    //             'type' => 'photo',
    //             'file' => $file2,
    //         ]);

    //     $response->assertStatus(422)
    //         ->assertJsonValidationErrors(['type']);
    // }

    public function test_file_name_is_stored_correctly(): void
    {
        $file = UploadedFile::fake()->image('my-photo.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.file_name', 'my-photo.jpg');
    }

    public function test_mime_type_is_stored_correctly(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.mime_type', 'image/jpeg');
    }

    public function test_file_size_is_stored_correctly(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/documents', [
                'type' => 'photo',
                'file' => $file,
            ]);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('data.size'));
        $this->assertIsInt($response->json('data.size'));
    }
}
