<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
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
            'receiver_email' => ['required', 'email', 'exists:users,email', 'different:auth_user_email'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:999999.99'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'receiver_email.required' => 'Receiver email is required',
            'receiver_email.email' => 'Receiver email must be a valid email address',
            'receiver_email.exists' => 'Receiver not found',
            'receiver_email.different' => 'Cannot transfer to yourself',
            'amount.required' => 'Amount is required',
            'amount.numeric' => 'Amount must be a number',
            'amount.min' => 'Amount must be greater than 0',
            'amount.max' => 'Amount cannot exceed 999,999.99',
            'description.max' => 'Description cannot exceed 500 characters',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'auth_user_email' => auth()->user()?->email,
        ]);
    }
}
