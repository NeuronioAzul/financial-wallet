<?php

namespace Database\Factories;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserDocument>
 */
class UserDocumentFactory extends Factory
{
    protected $model = UserDocument::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $documentType = fake()->randomElement(DocumentType::cases());

        return [
            'id' => Str::uuid(),
            'user_id' => User::factory(),
            'document_type' => $documentType,
            'file_path' => 'documents/'.Str::uuid().'.pdf',
            'file_name' => 'document_'.$documentType->value.'.pdf',
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(10000, 500000),
            'status' => DocumentStatus::PENDING,
            'verified_by' => null,
            'verified_at' => null,
            'rejection_reason' => null,
        ];
    }

    /**
     * Indicate that the document is a photo.
     */
    public function photo(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentType::PHOTO,
            'file_name' => 'photo.jpg',
            'mime_type' => 'image/jpeg',
        ]);
    }

    /**
     * Indicate that the document is RG front.
     */
    public function rgFront(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentType::RG_FRONT,
            'file_name' => 'rg_front.jpg',
            'mime_type' => 'image/jpeg',
        ]);
    }

    /**
     * Indicate that the document is RG back.
     */
    public function rgBack(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentType::RG_BACK,
            'file_name' => 'rg_back.jpg',
            'mime_type' => 'image/jpeg',
        ]);
    }

    /**
     * Indicate that the document is CNH front.
     */
    public function cnhFront(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentType::CNH_FRONT,
            'file_name' => 'cnh_front.jpg',
            'mime_type' => 'image/jpeg',
        ]);
    }

    /**
     * Indicate that the document is CNH back.
     */
    public function cnhBack(): static
    {
        return $this->state(fn (array $attributes) => [
            'document_type' => DocumentType::CNH_BACK,
            'file_name' => 'cnh_back.jpg',
            'mime_type' => 'image/jpeg',
        ]);
    }

    /**
     * Indicate that the document is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DocumentStatus::APPROVED,
            'verified_by' => User::factory(),
            'verified_at' => now(),
        ]);
    }

    /**
     * Indicate that the document is rejected.
     */
    public function rejected(string $reason = 'Document is not clear'): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DocumentStatus::REJECTED,
            'verified_by' => User::factory(),
            'verified_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Indicate that the document is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DocumentStatus::PENDING,
            'verified_by' => null,
            'verified_at' => null,
            'rejection_reason' => null,
        ]);
    }
}
