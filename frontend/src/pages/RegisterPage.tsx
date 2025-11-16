import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User as UserIcon, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerSchema } from '@/utils/validations';
import { RegisterRequest } from '@/types';
import { cleanCPF, formatCPF } from '@/utils/formatters';

type RegisterFormData = RegisterRequest & { terms: boolean };

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const cpfValue = watch('document');

  useEffect(() => {
    if (cpfValue) {
      const formatted = formatCPF(cpfValue);
      if (formatted !== cpfValue) {
        setValue('document', formatted, { shouldValidate: true });
      }
    }
  }, [cpfValue, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const cleanedData = {
        ...data,
        document: cleanCPF(data.document),
      };
      await registerUser(cleanedData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Financial Wallet</h1>
          <p className="text-accent text-lg">Grupo Adriano</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold gradient-text mb-6">Criar Conta</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('name')}
              label="Nome Completo"
              type="text"
              placeholder="João da Silva"
              icon={<UserIcon size={20} />}
              error={errors.name?.message}
            />

            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail size={20} />}
              error={errors.email?.message}
            />

            <Input
              {...register('document')}
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              icon={<CreditCard size={20} />}
              error={errors.document?.message}
              maxLength={14}
            />

            <Input
              {...register('password')}
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              error={errors.password?.message}
            />

            <Input
              {...register('password_confirmation')}
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              error={errors.password_confirmation?.message}
            />

            <div className="flex items-start gap-2">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-primary focus:ring-accent"
                id="terms"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                Eu aceito os{' '}
                <a href="#" className="text-accent hover:text-accent-dark font-semibold">
                  termos e condições
                </a>{' '}
                e a{' '}
                <a href="#" className="text-accent hover:text-accent-dark font-semibold">
                  política de privacidade
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500 -mt-2">{errors.terms.message}</p>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-card p-3 text-sm text-gray-700">
              <p className="font-semibold mb-1">Requisitos da senha:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Mínimo de 8 caracteres</li>
                <li>Pelo menos 1 letra maiúscula</li>
                <li>Pelo menos 1 número</li>
                <li>Pelo menos 1 caractere especial (!@#$%...)</li>
              </ul>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Já tem uma conta? </span>
            <Link to="/login" className="text-accent hover:text-accent-dark font-semibold">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
