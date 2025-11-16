import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, User, MapPin, FileText, Lock, Save, Eye, EyeOff, Settings, Moon, Sun, Contrast } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { profileService } from '@/services';
import { formatCPF } from '@/utils/formatters';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
});

const addressSchema = z.object({
  street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, 'Bairro deve ter pelo menos 3 caracteres'),
  city: z.string().min(3, 'Cidade deve ter pelo menos 3 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  postal_code: z.string().min(8, 'CEP inválido'),
});

const passwordSchema = z.object({
  current_password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  new_password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  new_password_confirmation: z.string().min(8, 'Confirmação obrigatória'),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "As senhas não coincidem",
  path: ["new_password_confirmation"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, contrast, setTheme, setContrast } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'documents' | 'security' | 'settings'>('profile');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [address, setAddress] = useState<any>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (activeTab === 'address') {
      loadAddress();
    }
  }, [activeTab]);

  const loadAddress = async () => {
    try {
      const data = await profileService.getAddress();
      if (data) {
        setAddress(data);
        addressForm.reset({
          street: data.street,
          number: data.number,
          complement: data.complement || '',
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
        });
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Erro ao carregar endereço');
      }
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    setLoadingProfile(true);
    try {
      await profileService.updateProfile(data);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    setLoadingAddress(true);
    try {
      if (address) {
        await profileService.updateAddress(data);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        await profileService.createAddress(data);
        toast.success('Endereço cadastrado com sucesso!');
      }
      loadAddress();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar endereço');
    } finally {
      setLoadingAddress(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setLoadingPassword(true);
    try {
      await profileService.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      });
      toast.success('Senha alterada com sucesso!');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setLoadingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Dados Pessoais', icon: User },
    { id: 'address' as const, label: 'Endereço', icon: MapPin },
    { id: 'documents' as const, label: 'Documentos', icon: FileText },
    { id: 'security' as const, label: 'Segurança', icon: Lock },
    { id: 'settings' as const, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold gradient-text">Meu Perfil</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card title="Dados Pessoais" subtitle="Atualize suas informações pessoais">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <Input
                label="Nome Completo"
                placeholder="Seu nome completo"
                error={profileForm.formState.errors.name?.message}
                {...profileForm.register('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                error={profileForm.formState.errors.email?.message}
                {...profileForm.register('email')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={formatCPF(user?.document || '')}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">CPF não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status da Conta
                </label>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user?.status === 'active' ? 'Ativa' : user?.status}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" isLoading={loadingProfile}>
                  <Save size={20} />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <Card title="Endereço" subtitle="Gerencie seu endereço de cadastro">
            <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Rua"
                    placeholder="Nome da rua"
                    error={addressForm.formState.errors.street?.message}
                    {...addressForm.register('street')}
                  />
                </div>
                <Input
                  label="Número"
                  placeholder="123"
                  error={addressForm.formState.errors.number?.message}
                  {...addressForm.register('number')}
                />
              </div>

              <Input
                label="Complemento (opcional)"
                placeholder="Apto, bloco, etc."
                error={addressForm.formState.errors.complement?.message}
                {...addressForm.register('complement')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bairro"
                  placeholder="Nome do bairro"
                  error={addressForm.formState.errors.neighborhood?.message}
                  {...addressForm.register('neighborhood')}
                />
                <Input
                  label="CEP"
                  placeholder="00000-000"
                  error={addressForm.formState.errors.postal_code?.message}
                  {...addressForm.register('postal_code')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Cidade"
                    placeholder="Nome da cidade"
                    error={addressForm.formState.errors.city?.message}
                    {...addressForm.register('city')}
                  />
                </div>
                <Input
                  label="Estado"
                  placeholder="UF"
                  maxLength={2}
                  error={addressForm.formState.errors.state?.message}
                  {...addressForm.register('state')}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" isLoading={loadingAddress}>
                  <Save size={20} />
                  {address ? 'Atualizar Endereço' : 'Cadastrar Endereço'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <Card title="Documentos" subtitle="Gerencie seus documentos cadastrados">
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Gerenciamento de documentos</p>
              <p className="text-sm text-gray-500">
                Em breve você poderá enviar e gerenciar seus documentos
              </p>
            </div>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card title="Segurança" subtitle="Altere sua senha de acesso">
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <Input
                label="Senha Atual"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Sua senha atual"
                error={passwordForm.formState.errors.current_password?.message}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                {...passwordForm.register('current_password')}
              />

              <Input
                label="Nova Senha"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                error={passwordForm.formState.errors.new_password?.message}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                {...passwordForm.register('new_password')}
              />

              <Input
                label="Confirmar Nova Senha"
                type="password"
                placeholder="Digite a senha novamente"
                error={passwordForm.formState.errors.new_password_confirmation?.message}
                {...passwordForm.register('new_password_confirmation')}
              />

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2 font-medium">Requisitos da senha:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Mínimo de 8 caracteres</li>
                  <li>• Use uma combinação de letras e números</li>
                  <li>• Evite senhas fáceis de adivinhar</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button type="submit" isLoading={loadingPassword}>
                  <Lock size={20} />
                  Alterar Senha
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card title="Configurações" subtitle="Personalize a aparência do sistema">
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  Tema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-yellow-100">
                        <Sun size={20} className="text-yellow-600" />
                      </div>
                      <span className="font-medium text-gray-900">Modo Claro</span>
                      {theme === 'light' && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Interface clara e brilhante, ideal para ambientes bem iluminados
                    </p>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-100">
                        <Moon size={20} className="text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-900">Modo Escuro</span>
                      {theme === 'dark' && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Interface escura que reduz a fadiga visual em ambientes com pouca luz
                    </p>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Contrast size={20} />
                  Contraste
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setContrast('normal')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      contrast === 'normal'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <div className="w-5 h-5 rounded border-2 border-gray-400"></div>
                      </div>
                      <span className="font-medium text-gray-900">Contraste Normal</span>
                      {contrast === 'normal' && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Aparência padrão com cores balanceadas
                    </p>
                  </button>

                  <button
                    onClick={() => setContrast('high')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      contrast === 'high'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gray-900">
                        <div className="w-5 h-5 rounded border-2 border-white"></div>
                      </div>
                      <span className="font-medium text-gray-900">Alto Contraste</span>
                      {contrast === 'high' && (
                        <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Cores mais vibrantes para melhor visibilidade e acessibilidade
                    </p>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2 font-medium">ℹ️ Sobre as configurações de aparência</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• As configurações são salvas automaticamente no seu navegador</li>
                  <li>• O modo escuro pode ajudar a reduzir o cansaço visual</li>
                  <li>• O alto contraste melhora a acessibilidade para pessoas com baixa visão</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

