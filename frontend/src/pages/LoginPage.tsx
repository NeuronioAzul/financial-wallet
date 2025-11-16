import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginSchema } from '@/utils/validations';
import { LoginRequest } from '@/types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
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
          <h2 className="text-2xl font-bold gradient-text mb-6">Entrar</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail size={20} />}
              error={errors.email?.message}
            />

            <Input
              {...register('password')}
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-accent" />
                <span className="text-gray-700">Lembrar-me</span>
              </label>
              <Link to="/forgot-password" className="text-accent hover:text-accent-dark font-semibold">
                Esqueci minha senha
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link to="/register" className="text-accent hover:text-accent-dark font-semibold">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
