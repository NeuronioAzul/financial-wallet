import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

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
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-light items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <Wallet className="h-8 w-8 text-golden-sand" />
            </div>
            <h1 className="text-3xl font-bold text-golden-sand">Grupo Adriano</h1>
          </div>
          <h2 className="mb-4 text-4xl font-bold leading-tight">
            Comece sua jornada financeira
          </h2>
          <p className="text-lg text-white/80">
            Crie sua conta gratuitamente e tenha acesso a uma plataforma 
            completa para gerenciar suas finanças com segurança e praticidade.
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-golden-sand" />
              <span className="text-xl font-bold text-golden-sand">Grupo Adriano</span>
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">Criar sua conta</h2>
          <p className="mb-8 text-gray-600">
            Preencha os dados abaixo para começar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="João da Silva"
                {...register('name')}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="document" className="text-sm font-medium text-gray-700">
                CPF
              </label>
              <Input
                id="document"
                type="text"
                placeholder="000.000.000-00"
                {...register('document')}
                disabled={isLoading}
                maxLength={14}
              />
              {errors.document && (
                <p className="text-sm text-red-600">{errors.document.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password_confirmation')}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-semibold mb-1">Requisitos da senha:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Mínimo de 8 caracteres</li>
                <li>Pelo menos 1 letra maiúscula</li>
                <li>Pelo menos 1 número</li>
                <li>Pelo menos 1 caractere especial (!@#$%...)</li>
              </ul>
            </div>

            <div className="flex items-start gap-2">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                id="terms"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                Eu aceito os{' '}
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  termos e condições
                </a>{' '}
                e a{' '}
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  política de privacidade
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-golden-sand text-gray-900 font-bold hover:bg-golden-sand-dark hover:shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Fazer login
              </Link>
            </p>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                <ArrowLeft size={16} />
                Voltar para login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
