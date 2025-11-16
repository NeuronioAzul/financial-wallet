import { z } from 'zod';
import { validateCPF } from './formatters';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Senha deve conter pelo menos um caractere especial'
      ),
    password_confirmation: z.string(),
    document: z
      .string()
      .min(11, 'CPF deve ter 11 dígitos')
      .refine(validateCPF, 'CPF inválido'),
    terms: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'],
  });

export const transferSchema = z.object({
  recipient_email: z.string().email('Email do destinatário inválido'),
  amount: z
    .number()
    .min(0.01, 'Valor mínimo de R$ 0,01')
    .max(999999.99, 'Valor máximo de R$ 999.999,99'),
  description: z.string().max(255, 'Descrição muito longa').optional(),
});

export const depositSchema = z.object({
  amount: z
    .number()
    .min(0.01, 'Valor mínimo de R$ 0,01')
    .max(999999.99, 'Valor máximo de R$ 999.999,99'),
  description: z.string().max(255, 'Descrição muito longa').optional(),
});
