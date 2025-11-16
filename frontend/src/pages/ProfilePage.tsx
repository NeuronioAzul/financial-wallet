import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, User, MapPin, FileText, Lock, Save, Eye, EyeOff, Settings, Moon, Sun, Contrast, Check, Upload, Trash2, Download } from 'lucide-react';
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
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

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
    if (activeTab === 'documents') {
      loadDocuments();
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

  const loadDocuments = async () => {
    setLoadingDocuments(true);
    try {
      const data = await profileService.getDocuments();
      setDocuments(data);
    } catch (error: any) {
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação de tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande (máximo 5MB)');
      return;
    }

    // Validação de tipo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido (use PDF, JPG ou PNG)');
      return;
    }

    setUploadingDocument(true);
    try {
      await profileService.uploadDocument(file, type);
      toast.success('Documento enviado com sucesso!');
      loadDocuments();
      // Limpar o input
      event.target.value = '';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar documento');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      await profileService.deleteDocument(documentId);
      setDocuments(prev => prev.filter(d => d.id !== documentId));
      toast.success('Documento excluído com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao excluir documento');
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

  // Funções para ofuscar dados sensíveis (LGPD)
  const obfuscateEmail = (email: string) => {
    if (!email || showSensitiveData) return email;
    const [username, domain] = email.split('@');
    if (!domain) return email;
    const visibleChars = Math.min(3, username.length);
    return `${username.slice(0, visibleChars)}${'*'.repeat(username.length - visibleChars)}@${domain}`;
  };

  const obfuscateCPF = (cpf: string) => {
    if (!cpf || showSensitiveData) return formatCPF(cpf);
    const formatted = formatCPF(cpf);
    return formatted.replace(/\d(?=\d{2})/g, '*');
  };

  const obfuscateName = (name: string) => {
    if (!name || showSensitiveData) return name;
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0) + '*'.repeat(parts[0].length - 1);
    }
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    const middleNames = parts.slice(1, -1).map(n => n.charAt(0) + '.');
    return `${firstName} ${middleNames.join(' ')} ${lastName.charAt(0)}${'*'.repeat(lastName.length - 1)}`;
  };

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
            {/* LGPD Toggle */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Proteção de Dados (LGPD)</p>
                  <p className="text-xs text-blue-700">
                    {showSensitiveData ? 'Dados sensíveis visíveis' : 'Dados sensíveis ofuscados por segurança'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showSensitiveData
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                }`}
              >
                {showSensitiveData ? <EyeOff size={16} /> : <Eye size={16} />}
                {showSensitiveData ? 'Ocultar Dados' : 'Mostrar Dados'}
              </button>
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={obfuscateName(user?.name || '')}
                    disabled={!showSensitiveData}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      showSensitiveData 
                        ? 'bg-white text-gray-900' 
                        : 'bg-gray-50 text-gray-500 cursor-not-allowed font-mono'
                    }`}
                  />
                  {showSensitiveData && (
                    <Input
                      label=""
                      placeholder="Seu nome completo"
                      error={profileForm.formState.errors.name?.message}
                      {...profileForm.register('name')}
                      className="mt-2"
                    />
                  )}
                </div>
                {!showSensitiveData && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Eye size={12} /> Clique em "Mostrar Dados" para editar
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={obfuscateEmail(user?.email || '')}
                    disabled={!showSensitiveData}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      showSensitiveData 
                        ? 'bg-white text-gray-900' 
                        : 'bg-gray-50 text-gray-500 cursor-not-allowed font-mono'
                    }`}
                  />
                  {showSensitiveData && (
                    <Input
                      label=""
                      type="email"
                      placeholder="seu@email.com"
                      error={profileForm.formState.errors.email?.message}
                      {...profileForm.register('email')}
                      className="mt-2"
                    />
                  )}
                </div>
                {!showSensitiveData && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Eye size={12} /> Clique em "Mostrar Dados" para editar
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={obfuscateCPF(user?.document || '')}
                  disabled
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed ${
                    showSensitiveData ? 'text-gray-900' : 'text-gray-500 font-mono'
                  }`}
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

              {showSensitiveData && (
                <div className="pt-4">
                  <Button type="submit" isLoading={loadingProfile}>
                    <Save size={20} />
                    Salvar Alterações
                  </Button>
                </div>
              )}
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
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                  <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Enviar Documento
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    PDF, JPG ou PNG até 5MB
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                    {[
                      { type: 'rg', label: 'RG' },
                      { type: 'cnh', label: 'CNH' },
                      { type: 'cpf', label: 'CPF' },
                      { type: 'comprovante_residencia', label: 'Comprovante de Residência' },
                      { type: 'cartao_credito', label: 'Cartão de Crédito' },
                      { type: 'outros', label: 'Outros' },
                    ].map(({ type, label }) => (
                      <div key={type} className="relative">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, type)}
                          className="hidden"
                          id={`upload-${type}`}
                          disabled={uploadingDocument}
                        />
                        <label
                          htmlFor={`upload-${type}`}
                          className={`block px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors cursor-pointer
                            ${uploadingDocument 
                              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                              : 'bg-white border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white'
                            }`}
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {uploadingDocument && (
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 text-sm text-ocean-blue">
                        <div className="w-4 h-4 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin"></div>
                        Enviando documento...
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents List */}
              {loadingDocuments ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Carregando documentos...
                  </div>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-1">Nenhum documento enviado</p>
                  <p className="text-sm text-gray-500">
                    Clique em um dos botões acima para enviar seu primeiro documento
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Documentos Enviados ({documents.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            <FileText size={24} className="text-ocean-blue" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium px-2 py-1 rounded bg-ocean-blue/10 text-ocean-blue uppercase">
                                {doc.type?.replace('_', ' ') || 'Documento'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 truncate">
                              {doc.file_name || 'Documento'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Enviado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-ocean-blue hover:bg-ocean-blue/10 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-burgundy-red hover:bg-burgundy-red/10 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                        <div className="ml-auto p-1 bg-primary rounded-full">
                          <Check size={16} className="text-white" />
                        </div>
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
                        <div className="ml-auto p-1 bg-primary rounded-full">
                          <Check size={16} className="text-white" />
                        </div>
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

