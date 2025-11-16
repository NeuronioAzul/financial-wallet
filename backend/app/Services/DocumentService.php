<?php

namespace App\Services;

use App\Enums\DocumentStatus;
use App\Enums\DocumentType;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    public function uploadDocument(User $user, DocumentType $documentType, UploadedFile $file): UserDocument
    {
        $userId = $user->id;
        $timestamp = now()->format('YmdHis');
        $extension = $file->getClientOriginalExtension();
        $fileName = "{$documentType->value}_{$timestamp}.{$extension}";

        // Armazena em storage/app/private/documents/{user_id}/
        $path = $file->storeAs("documents/{$userId}", $fileName, 'local');

        return UserDocument::create([
            'user_id' => $userId,
            'document_type' => $documentType,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'status' => DocumentStatus::PENDING,
        ]);
    }

    public function deleteDocument(UserDocument $document): bool
    {
        // Remove arquivo do storage
        if (Storage::exists($document->file_path)) {
            Storage::delete($document->file_path);
        }

        return $document->delete();
    }

    public function getUserDocuments(User $user): Collection
    {
        return $user->documents()->orderBy('created_at', 'desc')->get();
    }

    public function getDocumentStatus(User $user): array
    {
        $documents = $user->documents;

        $hasPhoto = $documents->where('document_type', DocumentType::PHOTO)->isNotEmpty();
        $hasRG = $documents->whereIn('document_type', [DocumentType::RG_FRONT, DocumentType::RG_BACK])->count() === 2;
        $hasCNH = $documents->whereIn('document_type', [DocumentType::CNH_FRONT, DocumentType::CNH_BACK])->count() === 2;

        $allApproved = $documents->every(fn ($doc) => $doc->status === DocumentStatus::APPROVED);
        $hasRejected = $documents->contains(fn ($doc) => $doc->status === DocumentStatus::REJECTED);
        $hasPending = $documents->contains(fn ($doc) => $doc->status === DocumentStatus::PENDING);

        return [
            'has_photo' => $hasPhoto,
            'has_rg' => $hasRG,
            'has_cnh' => $hasCNH,
            'is_complete' => $hasPhoto && ($hasRG || $hasCNH),
            'all_approved' => $allApproved,
            'has_rejected' => $hasRejected,
            'has_pending' => $hasPending,
            'verification_status' => $this->getVerificationStatus($allApproved, $hasRejected, $hasPending),
        ];
    }

    private function getVerificationStatus(bool $allApproved, bool $hasRejected, bool $hasPending): string
    {
        if ($allApproved) {
            return 'verified';
        }

        if ($hasRejected) {
            return 'rejected';
        }

        if ($hasPending) {
            return 'pending';
        }

        return 'incomplete';
    }
}
