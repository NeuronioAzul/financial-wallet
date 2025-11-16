<?php

namespace Tests\Unit\Models;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $document = UserDocument::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $document->user);
        $this->assertEquals($user->id, $document->user->id);
    }

    public function test_casts_document_type_to_enum(): void
    {
        $document = UserDocument::factory()->create(['document_type' => DocumentType::PHOTO]);

        $this->assertInstanceOf(DocumentType::class, $document->document_type);
        $this->assertEquals(DocumentType::PHOTO, $document->document_type);
    }

    public function test_casts_status_to_enum(): void
    {
        $document = UserDocument::factory()->create(['status' => DocumentStatus::PENDING]);

        $this->assertInstanceOf(DocumentStatus::class, $document->status);
        $this->assertEquals(DocumentStatus::PENDING, $document->status);
    }

    public function test_fillable_attributes(): void
    {
        $data = [
            'user_id' => User::factory()->create()->id,
            'document_type' => DocumentType::RG_FRONT,
            'file_path' => 'documents/test.jpg',
            'file_name' => 'test.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'status' => DocumentStatus::APPROVED,
        ];

        $document = UserDocument::create($data);

        $this->assertEquals('test.jpg', $document->file_name);
        $this->assertEquals(DocumentStatus::APPROVED, $document->status);
    }

    public function test_casts_verified_at_to_datetime(): void
    {
        $document = UserDocument::factory()->create(['verified_at' => now()]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $document->verified_at);
    }
}
