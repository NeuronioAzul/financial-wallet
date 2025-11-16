<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('zip_code')) {
            $this->merge([
                'zip_code' => preg_replace('/\D/', '', $this->zip_code),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'zip_code' => ['required', 'string', 'size:8', 'regex:/^\d{8}$/'],
            'street' => ['required', 'string', 'max:255'],
            'number' => ['required', 'string', 'max:20'],
            'complement' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'size:2', 'regex:/^[A-Z]{2}$/'],
            'country' => ['sometimes', 'string', 'max:100'],
            'is_primary' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'zip_code.required' => 'ZIP code is required',
            'zip_code.size' => 'ZIP code must have 8 digits',
            'zip_code.regex' => 'ZIP code must contain only numbers',
            'state.size' => 'State must be 2 characters (UF)',
            'state.regex' => 'State must be uppercase letters (e.g., SP, RJ)',
        ];
    }
}
