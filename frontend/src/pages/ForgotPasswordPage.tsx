import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Financial Wallet</h1>
          <p className="text-accent text-lg">Grupo Adriano</p>
        </div>

        <div className="card">
          {!emailSent ? (
            <>
              <h2 className="text-2xl font-bold gradient-text mb-2">
                Esqueceu sua senha?
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Digite seu email e enviaremos instruções para redefinir sua senha.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  {...register('email')}
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  icon={<Mail size={20} />}
                  error={errors.email?.message}
                />

                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  Enviar Instruções
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-2">
                Email Enviado!
              </h2>
              <p className="text-gray-600 mb-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <Link to="/login">
                <Button variant="primary" fullWidth>
                  Voltar para Login
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
