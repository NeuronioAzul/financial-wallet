import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet, ArrowLeft, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { z } from 'zod';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implementar chamada à API quando o endpoint estiver disponível
      // await api.post('/v1/forgot-password', data);
      
      // Simulação de sucesso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success('Email de recuperação enviado com sucesso!');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Erro ao enviar email. Tente novamente.');
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
            Recupere o acesso à sua conta
          </h2>
          <p className="text-lg text-white/80">
            Não se preocupe! Acontece com todos. Digite seu email e 
            enviaremos instruções para redefinir sua senha de forma segura.
          </p>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-golden-sand" />
              <span className="text-xl font-bold text-golden-sand">Grupo Adriano</span>
            </div>
          </div>

          {!emailSent ? (
            <>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Esqueceu sua senha?
              </h2>
              <p className="mb-8 text-gray-600">
                Digite seu email e enviaremos instruções para redefinir sua senha.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                <Button
                  type="submit"
                  className="w-full bg-golden-sand text-gray-900 font-bold hover:bg-golden-sand-dark hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Instruções'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                  >
                    <ArrowLeft size={16} />
                    Voltar para login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Email Enviado!
              </h2>
              <p className="text-gray-600 mb-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <Link to="/login">
                <Button className="w-full bg-golden-sand text-gray-900 font-bold hover:bg-golden-sand-dark hover:shadow-lg transition-all">
                  Voltar para Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
