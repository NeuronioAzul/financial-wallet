<?php

namespace Tests\Unit\Services;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use App\Models\User;
use App\Models\UserDocument;
use App\Services\DocumentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentServiceTest extends TestCase
{
    use RefreshDatabase;

    private DocumentService $service;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
        $this->service = new DocumentService();
        $this->user = User::factory()->create();
    }

    public function test_upload_document_creates_record(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $document = $this->service->uploadDocument($this->user, DocumentType::PHOTO, $file);

        $this->assertInstanceOf(UserDocument::class, $document);
        $this->assertEquals(DocumentType::PHOTO, $document->document_type);
        $this->assertEquals(DocumentStatus::PENDING, $document->status);
    }

    public function test_upload_document_stores_file(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $document = $this->service->uploadDocument($this->user, DocumentType::PHOTO, $file);

        Storage::disk('local')->assertExists($document->file_path);
    }

    public function test_delete_document_removes_file(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');
        $document = $this->service->uploadDocument($this->user, DocumentType::PHOTO, $file);

        $this->service->deleteDocument($document);

        Storage::disk('local')->assertMissing($document->file_path);
    }

    public function test_delete_document_removes_record(): void
    {
        $file = UploadedFile::fake()->image('photo.jpg');
        $document = $this->service->uploadDocument($this->user, DocumentType::PHOTO, $file);

        $result = $this->service->deleteDocument($document);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('user_documents', ['id' => $document->id]);
    }

    public function test_get_user_documents_returns_collection(): void
    {
        UserDocument::factory()->count(3)->create(['user_id' => $this->user->id]);

        $documents = $this->service->getUserDocuments($this->user);

        $this->assertCount(3, $documents);
    }

    public function test_get_document_status_returns_array(): void
    {
        UserDocument::factory()->create(['user_id' => $this->user->id, 'document_type' => DocumentType::PHOTO]);

        $status = $this->service->getDocumentStatus($this->user);

        $this->assertIsArray($status);
        $this->assertArrayHasKey('has_photo', $status);
        $this->assertTrue($status['has_photo']);
    }

    public function test_document_status_checks_completeness(): void
    {
        UserDocument::factory()->create(['user_id' => $this->user->id, 'document_type' => DocumentType::PHOTO]);
        UserDocument::factory()->create(['user_id' => $this->user->id, 'document_type' => DocumentType::RG_FRONT]);
        UserDocument::factory()->create(['user_id' => $this->user->id, 'document_type' => DocumentType::RG_BACK]);

        $status = $this->service->getDocumentStatus($this->user);

        $this->assertTrue($status['is_complete']);
    }
}
