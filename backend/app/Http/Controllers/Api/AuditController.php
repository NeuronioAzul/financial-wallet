<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OwenIt\Auditing\Models\Audit;

class AuditController extends Controller
{
    /**
     * Display a paginated listing of the user's audit logs.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);

        // Get audits for the authenticated user
        $audits = Audit::where('user_id', $request->user()->id)
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $audits->items(),
            'meta' => [
                'current_page' => $audits->currentPage(),
                'last_page' => $audits->lastPage(),
                'per_page' => $audits->perPage(),
                'total' => $audits->total(),
                'from' => $audits->firstItem(),
                'to' => $audits->lastItem(),
            ],
            'links' => [
                'first' => $audits->url(1),
                'last' => $audits->url($audits->lastPage()),
                'prev' => $audits->previousPageUrl(),
                'next' => $audits->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Display the specified audit log.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $audit = Audit::where('user_id', $request->user()->id)
            ->with(['user:id,name,email'])
            ->findOrFail($id);

        return response()->json([
            'data' => $audit,
        ]);
    }
}
