<?php

namespace App\Http\Requests;

use App\Enums\DocumentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => [
                'required',
                Rule::enum(DocumentType::class),
            ],
            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:5120', // 5MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Document type is required',
            'file.required' => 'File is required',
            'file.mimes' => 'File must be JPG, JPEG, PNG or PDF',
            'file.max' => 'File size must not exceed 5MB',
        ];
    }
}
