<?php

namespace App\Http\Requests;

use App\Enums\UserStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
            'document' => ['required', 'string', 'size:11', 'unique:users,document', 'regex:/^\d{11}$/'],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^\d{10,11}$/'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.unique' => 'Email already registered',
            'password.required' => 'Password is required',
            'password.confirmed' => 'Password confirmation does not match',
            'document.required' => 'CPF is required',
            'document.size' => 'CPF must have 11 digits',
            'document.unique' => 'CPF already registered',
            'document.regex' => 'CPF must contain only numbers',
            'phone.regex' => 'Phone must contain only numbers (10 or 11 digits)',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Remove non-numeric characters from document and phone
        $this->merge([
            'document' => preg_replace('/\D/', '', $this->document ?? ''),
            'phone' => preg_replace('/\D/', '', $this->phone ?? ''),
        ]);
    }
}
