<?php

namespace Tests\Feature;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentUploadTest extends TestCase
{
    use RefreshDatabase;

    private function getFixturePath(string $filename): string
    {
        return __DIR__.'/../Fixtures/files/'.$filename;
    }

    private function createUploadedFile(string $fixturePath): UploadedFile
    {
        return new UploadedFile(
            $fixturePath,
            basename($fixturePath),
            mime_content_type($fixturePath),
            null,
            true
        );
    }

    public function test_can_upload_photo_document(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = $this->createUploadedFile($this->getFixturePath('images/test-photo.jpg'));

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/documents', [
                'type' => DocumentType::PHOTO->value,
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'document_type', 'status']])
            ->assertJson(['data' => [
                'document_type' => DocumentType::PHOTO->value,
                'status' => DocumentStatus::PENDING->value,
            ]]);
    }

    public function test_can_upload_pdf_document(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = $this->createUploadedFile($this->getFixturePath('documents/test-document.pdf'));

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/documents', [
                'type' => DocumentType::RG_FRONT->value,
                'file' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJson(['data' => ['document_type' => DocumentType::RG_FRONT->value]]);
    }

    public function test_cannot_upload_invalid_file_format(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = $this->createUploadedFile($this->getFixturePath('invalid/not-an-image.txt'));

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/documents', [
                'document_type' => DocumentType::PHOTO->value,
                'file' => $file,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('file');
    }

    public function test_cannot_upload_without_authentication(): void
    {
        Storage::fake('local');
        $file = $this->createUploadedFile($this->getFixturePath('images/test-photo.jpg'));

        $response = $this->postJson('/api/v1/documents', [
            'document_type' => DocumentType::PHOTO->value,
            'file' => $file,
        ]);

        $response->assertStatus(401);
    }

    public function test_requires_document_type(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $file = $this->createUploadedFile($this->getFixturePath('images/test-photo.jpg'));

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/documents', ['file' => $file]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('type');
    }

    public function test_requires_file(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/documents', [
                'document_type' => DocumentType::PHOTO->value,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('file');
    }

    public function test_can_list_user_documents(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/documents');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_get_document_validation_status(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
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
}
