<?php

namespace App\Http\Controllers\Api;

use App\Enums\DocumentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadDocumentRequest;
use App\Models\UserDocument;
use App\Services\DocumentService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private DocumentService $documentService)
    {
    }

    public function index(): JsonResponse
    {
        $documents = $this->documentService->getUserDocuments(auth()->user());

        return response()->json([
            'message' => 'Documents retrieved successfully',
            'data' => $documents,
        ]);
    }

    public function store(UploadDocumentRequest $request): JsonResponse
    {
        $document = $this->documentService->uploadDocument(
            auth()->user(),
            DocumentType::from($request->validated('document_type')),
            $request->file('file')
        );

        return response()->json([
            'message' => 'Document uploaded successfully',
            'data' => $document,
        ], 201);
    }

    public function show(UserDocument $document): JsonResponse
    {
        $this->authorize('view', $document);

        return response()->json([
            'message' => 'Document retrieved successfully',
            'data' => $document,
        ]);
    }

    public function destroy(UserDocument $document): JsonResponse
    {
        $this->authorize('delete', $document);

        $this->documentService->deleteDocument($document);

        return response()->json([
            'message' => 'Document deleted successfully',
        ]);
    }

    public function status(): JsonResponse
    {
        $status = $this->documentService->getDocumentStatus(auth()->user());

        return response()->json([
            'message' => 'Document status retrieved successfully',
            'data' => $status,
        ]);
    }
}
