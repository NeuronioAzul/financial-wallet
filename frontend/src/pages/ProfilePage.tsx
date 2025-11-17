import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, User, MapPin, FileText, Lock, Save, Eye, EyeOff, Settings, Moon, Sun, Check, Upload, Trash2, Download, Camera, X, AlertCircle, CheckCircle } from 'lucide-react';
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
  const { theme, setTheme } = useTheme();
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
  
  // Document upload modals
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentModalType, setDocumentModalType] = useState<string>('');
  const [documentModalStep, setDocumentModalStep] = useState<1 | 2 | 3>(1);
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  
  // Selfie modal states
  const [showSelfieModal, setShowSelfieModal] = useState(false);
  const [selfieStep, setSelfieStep] = useState<1 | 2 | 3>(1);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      toast.error('Erro ao carregar endereço');
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

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'rg': 'RG',
      'cnh': 'CNH',
      'cpf': 'CPF',
      'comprovante_residencia': 'Comp. Residência',
      'cartao_credito': 'Cartão de Crédito',
      'outros': 'Outros',
      'photo': 'Foto',
      'rg_front': 'RG Frente',
      'rg_back': 'RG Verso',
      'cnh_front': 'CNH Frente',
      'cnh_back': 'CNH Verso',
    };
    return labels[type] || type;
  };

  const getDocumentTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'rg': 'bg-blue-100 text-blue-700',
      'rg_front': 'bg-blue-100 text-blue-700',
      'rg_back': 'bg-blue-100 text-blue-700',
      'cnh': 'bg-purple-100 text-purple-700',
      'cnh_front': 'bg-purple-100 text-purple-700',
      'cnh_back': 'bg-purple-100 text-purple-700',
      'cpf': 'bg-green-100 text-green-700',
      'comprovante_residencia': 'bg-amber-100 text-amber-700',
      'cartao_credito': 'bg-pink-100 text-pink-700',
      'photo': 'bg-indigo-100 text-indigo-700',
      'outros': 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-ocean-blue/10 text-ocean-blue';
  };

  // Group documents by category
  const groupDocumentsByType = (docs: any[]) => {
    const groups: Record<string, any[]> = {
      photo: [],
      rg: [],
      cnh: [],
      cpf: [],
      comprovante_residencia: [],
      cartao_credito: [],
      outros: []
    };

    docs.forEach(doc => {
      const type = doc.document_type || doc.type;
      
      // Group RG variants together
      if (['rg', 'rg_front', 'rg_back'].includes(type)) {
        groups.rg.push(doc);
      }
      // Group CNH variants together
      else if (['cnh', 'cnh_front', 'cnh_back'].includes(type)) {
        groups.cnh.push(doc);
      }
      // Other types go to their own group
      else if (type === 'photo') {
        groups.photo.push(doc);
      } else if (type === 'cpf') {
        groups.cpf.push(doc);
      } else if (type === 'comprovante_residencia') {
        groups.comprovante_residencia.push(doc);
      } else if (type === 'cartao_credito') {
        groups.cartao_credito.push(doc);
      } else {
        groups.outros.push(doc);
      }
    });

    return groups;
  };

  const getGroupInfo = (groupKey: string) => {
    const info: Record<string, { icon: any; title: string; color: string; bgColor: string }> = {
      photo: {
        icon: User,
        title: 'Foto/Selfie',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50'
      },
      rg: {
        icon: FileText,
        title: 'RG',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50'
      },
      cnh: {
        icon: FileText,
        title: 'CNH',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50'
      },
      cpf: {
        icon: FileText,
        title: 'CPF',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50'
      },
      comprovante_residencia: {
        icon: MapPin,
        title: 'Comprovante de Residência',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50'
      },
      cartao_credito: {
        icon: FileText,
        title: 'Cartão de Crédito',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50'
      },
      outros: {
        icon: FileText,
        title: 'Outros Documentos',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50'
      }
    };
    return info[groupKey];
  };

  // Document modal handlers
  const openDocumentModal = (type: string) => {
    setDocumentModalType(type);
    setDocumentModalStep(1);
    // Auto-select subtype for documents without variants (CPF, comprovante, outros)
    if (type !== 'rg' && type !== 'cnh') {
      setSelectedSubtype(type);
    } else {
      setSelectedSubtype('');
    }
    setSelfiePreview(null);
    setCapturedFile(null);
    setUseCamera(false);
    setShowDocumentModal(true);
  };

  const closeDocumentModal = () => {
    setShowDocumentModal(false);
    setDocumentModalType('');
    setDocumentModalStep(1);
    setSelectedSubtype('');
    setSelfiePreview(null);
    setCapturedFile(null);
    setUseCamera(false);
    stopCamera();
  };

  const handleDocumentSubtypeSelect = (subtype: string) => {
    setSelectedSubtype(subtype);
    // Stay on step 2
  };

  const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
        setDocumentModalStep(3);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDocument = async () => {
    if (capturedFile && selectedSubtype) {
      await uploadDocumentFile(capturedFile, selectedSubtype);
      closeDocumentModal();
    }
  };

  const uploadDocumentFile = async (file: File, type: string) => {
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar documento');
    } finally {
      setUploadingDocument(false);
    }
  };

  // Selfie modal handlers
  const openSelfieModal = () => {
    setShowSelfieModal(true);
    setSelfieStep(1);
    setSelfiePreview(null);
    setCapturedFile(null);
  };

  const closeSelfieModal = () => {
    setShowSelfieModal(false);
    setSelfieStep(1);
    setSelfiePreview(null);
    setCapturedFile(null);
    setUseCamera(false);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      toast.error('Não foi possível acessar a câmera');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = showSelfieModal ? 'selfie.jpg' : 'document.jpg';
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            setCapturedFile(file);
            setSelfiePreview(canvas.toDataURL('image/jpeg'));
            
            // Update the correct step based on which modal is open
            if (showSelfieModal) {
              setSelfieStep(3);
            } else if (showDocumentModal) {
              setDocumentModalStep(3);
            }
            
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleSelfieFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
        setSelfieStep(3);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSelfie = async () => {
    if (capturedFile) {
      await uploadDocumentFile(capturedFile, 'photo');
      closeSelfieModal();
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
                    {/* Selfie/Foto */}
                    <button
                      onClick={openSelfieModal}
                      disabled={uploadingDocument}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2
                        ${uploadingDocument 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                      Foto/Selfie
                    </button>

                    {/* RG */}
                    <button
                      onClick={() => openDocumentModal('rg')}
                      disabled={uploadingDocument}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2
                        ${uploadingDocument 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                      RG
                    </button>

                    {/* CNH */}
                    <button
                      onClick={() => openDocumentModal('cnh')}
                      disabled={uploadingDocument}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2
                        ${uploadingDocument 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                      CNH
                    </button>

                    {/* CPF */}
                    <button
                      onClick={() => openDocumentModal('cpf')}
                      disabled={uploadingDocument}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2
                        ${uploadingDocument 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                      CPF
                    </button>

                    {/* Comprovante de Residência */}
                    <button
                      onClick={() => openDocumentModal('comprovante_residencia')}
                      disabled={uploadingDocument}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2
                        ${uploadingDocument 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                      Comp. Residência
                    </button>

                    {/* Outros */}
                    <button
                      onClick={() => openDocumentModal('outros')}
                      disabled={uploadingDocument}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all flex items-center gap-2
                        ${uploadingDocument 
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0"></span>
                      Outros
                    </button>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">
                      Documentos Enviados ({documents.length})
                    </h4>
                  </div>

                  {/* Grouped Documents by Type */}
                  <div className="space-y-3">
                    {Object.entries(groupDocumentsByType(documents)).map(([groupKey, docs]) => {
                      if (docs.length === 0) return null;
                      const groupInfo = getGroupInfo(groupKey);

                      return (
                        <div key={groupKey} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                          {/* Group Header */}
                          <div className={`${groupInfo.bgColor} px-4 py-3 border-b border-gray-200`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-white border border-gray-200`}>
                                {typeof groupInfo.icon === 'function' 
                                  ? <groupInfo.icon size={20} className={groupInfo.color} />
                                  : <FileText size={20} className={groupInfo.color} />
                                }
                              </div>
                              <div className="flex-1">
                                <h5 className={`text-sm font-semibold ${groupInfo.color}`}>
                                  {groupInfo.title}
                                </h5>
                                <p className="text-xs text-gray-600">
                                  {docs.length === 1 
                                    ? '1 arquivo' 
                                    : groupKey === 'rg' || groupKey === 'cnh'
                                      ? `${docs.length} arquivo${docs.length > 1 ? 's' : ''} (${docs.map(d => getDocumentTypeLabel(d.document_type || d.type)).join(', ')})`
                                      : `${docs.length} arquivo${docs.length > 1 ? 's' : ''}`
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Documents in Group */}
                          <div className="divide-y divide-gray-100">
                            {docs.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="flex-shrink-0">
                                    <div className="p-2 rounded-lg bg-gray-100 border border-gray-200">
                                      <FileText size={20} className="text-gray-600" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      {/* Show subtype badge only for RG/CNH variants */}
                                      {(groupKey === 'rg' || groupKey === 'cnh') && (
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${getDocumentTypeBadgeColor(doc.document_type || doc.type)}`}>
                                          {getDocumentTypeLabel(doc.document_type || doc.type)}
                                        </span>
                                      )}
                                      {doc.status && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          doc.status === 'approved' 
                                            ? 'bg-green-100 text-green-700' 
                                            : doc.status === 'rejected'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                          {doc.status === 'approved' ? '✓ Aprovado' : doc.status === 'rejected' ? '✗ Rejeitado' : '⏱ Pendente'}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-900 truncate font-medium">
                                      {doc.file_name || 'Documento'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Enviado em {new Date(doc.created_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {doc.file_url && (
                                    <a
                                      href={doc.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 text-ocean-blue dark:text-royal-blue hover:bg-ocean-blue/10 dark:hover:bg-royal-blue/20 rounded-lg transition-colors"
                                      title="Download"
                                    >
                                      <Download size={18} />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="p-2 text-burgundy-red dark:text-red-400 hover:bg-burgundy-red/10 dark:hover:bg-red-400/20 rounded-lg transition-colors"
                                    title="Excluir"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
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
                        <div className="ml-auto p-1 bg-primary rounded-full">
                          <Check size={16} className="text-white" />
                        </div>
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
                        <div className="ml-auto p-1 bg-primary rounded-full">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      Interface escura que reduz a fadiga visual em ambientes com pouca luz
                    </p>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2 font-medium">ℹ️ Sobre as configurações de aparência</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• As configurações são salvas automaticamente no seu navegador</li>
                  <li>• O modo escuro pode ajudar a reduzir o cansaço visual</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* Document Type Selection Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            {/* Step 1: Instructions */}
            {documentModalStep === 1 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {documentModalType === 'rg' && '🪪 Como fotografar seu RG'}
                    {documentModalType === 'cnh' && '🚗 Como fotografar sua CNH'}
                    {documentModalType === 'cpf' && '📋 Como fotografar seu CPF'}
                    {documentModalType === 'comprovante_residencia' && '📍 Como fotografar seu Comprovante'}
                    {documentModalType === 'outros' && '📄 Como fotografar seu Documento'}
                  </h3>
                  <button
                    onClick={closeDocumentModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Boa iluminação</div>
                      <div className="text-sm text-blue-700">Tire a foto em um ambiente bem iluminado, evite sombras sobre o documento</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Imagem nítida</div>
                      <div className="text-sm text-blue-700">Certifique-se de que todos os dados estão legíveis e sem desfoque</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Enquadramento correto</div>
                      <div className="text-sm text-blue-700">O documento deve ocupar a maior parte da foto, sem cortes nas bordas</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Sem reflexos</div>
                      <div className="text-sm text-blue-700">Evite reflexos de luz que possam ocultar informações do documento</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeDocumentModal}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setDocumentModalStep(2)}
                    className="flex-1 px-4 py-3 bg-ocean-blue text-white rounded-lg font-medium hover:bg-ocean-blue/90 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Select Subtype (RG/CNH) or Capture Method */}
            {documentModalStep === 2 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {(documentModalType === 'rg' || documentModalType === 'cnh') && !selectedSubtype && (
                      <>{documentModalType === 'rg' ? '🪪 Qual parte do RG?' : '🚗 Qual parte da CNH?'}</>
                    )}
                    {((documentModalType !== 'rg' && documentModalType !== 'cnh') || selectedSubtype) && (
                      <>📷 Como deseja enviar?</>
                    )}
                  </h3>
                  <button
                    onClick={closeDocumentModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Show subtype selection for RG/CNH if not selected yet */}
                {(documentModalType === 'rg' || documentModalType === 'cnh') && !selectedSubtype ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      Escolha qual parte do documento você deseja enviar:
                    </p>

                    {documentModalType === 'rg' && (
                      <>
                        <button
                          onClick={() => handleDocumentSubtypeSelect('rg_front')}
                          className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                        >
                          <div className="font-medium text-blue-900">📄 Frente do RG</div>
                          <div className="text-sm text-blue-600 mt-1">Apenas a parte frontal do documento</div>
                        </button>
                        <button
                          onClick={() => handleDocumentSubtypeSelect('rg_back')}
                          className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                        >
                          <div className="font-medium text-blue-900">📄 Verso do RG</div>
                          <div className="text-sm text-blue-600 mt-1">Apenas a parte de trás do documento</div>
                        </button>
                        <button
                          onClick={() => handleDocumentSubtypeSelect('rg')}
                          className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                        >
                          <div className="font-medium text-blue-900">📄 RG Completo</div>
                          <div className="text-sm text-blue-600 mt-1">Frente e verso em uma única imagem</div>
                        </button>
                      </>
                    )}

                    {documentModalType === 'cnh' && (
                      <>
                        <button
                          onClick={() => handleDocumentSubtypeSelect('cnh_front')}
                          className="w-full p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div className="font-medium text-purple-900">📄 Frente da CNH</div>
                          <div className="text-sm text-purple-600 mt-1">Apenas a parte frontal do documento</div>
                        </button>
                        <button
                          onClick={() => handleDocumentSubtypeSelect('cnh_back')}
                          className="w-full p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div className="font-medium text-purple-900">📄 Verso da CNH</div>
                          <div className="text-sm text-purple-600 mt-1">Apenas a parte de trás do documento</div>
                        </button>
                        <button
                          onClick={() => handleDocumentSubtypeSelect('cnh')}
                          className="w-full p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div className="font-medium text-purple-900">📄 CNH Completa</div>
                          <div className="text-sm text-purple-600 mt-1">Frente e verso em uma única imagem</div>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setDocumentModalStep(1)}
                      className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Voltar
                    </button>
                  </div>
                ) : !useCamera ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setUseCamera(true);
                        startCamera();
                      }}
                      className="w-full p-6 border-2 border-ocean-blue rounded-lg hover:bg-ocean-blue/5 transition-all"
                    >
                      <Camera size={40} className="mx-auto text-ocean-blue mb-2" />
                      <div className="font-medium text-gray-900">Usar Câmera</div>
                      <div className="text-sm text-gray-600 mt-1">Tire uma foto do documento agora</div>
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">ou</span>
                      </div>
                    </div>

                    <label className="block">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleDocumentFileSelect}
                        className="hidden"
                      />
                      <div className="w-full p-6 border-2 border-gray-300 rounded-lg hover:border-ocean-blue hover:bg-ocean-blue/5 transition-all cursor-pointer">
                        <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                        <div className="font-medium text-gray-900">Enviar Arquivo</div>
                        <div className="text-sm text-gray-600 mt-1">Selecione uma foto ou PDF do seu dispositivo</div>
                      </div>
                    </label>

                    <button
                      onClick={() => {
                        if (documentModalType === 'rg' || documentModalType === 'cnh') {
                          setSelectedSubtype('');
                        } else {
                          setDocumentModalStep(1);
                        }
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Voltar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full"
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        ⚠️ Posicione o documento completamente visível na tela e evite reflexos
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          stopCamera();
                          setUseCamera(false);
                        }}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="flex-1 px-4 py-3 bg-ocean-blue text-white rounded-lg font-medium hover:bg-ocean-blue/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Camera size={20} />
                        Capturar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Preview and Confirm */}
            {documentModalStep === 3 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">✓ Confirmar Documento</h3>
                  <button
                    onClick={closeDocumentModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    {selfiePreview && (
                      <img
                        src={selfiePreview}
                        alt="Preview"
                        className="w-full"
                      />
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Verifique se a imagem está adequada:</p>
                        <ul className="space-y-1 text-xs">
                          <li>✓ Todos os dados estão legíveis</li>
                          <li>✓ Não há reflexos ou sombras</li>
                          <li>✓ O documento está completamente visível</li>
                          <li>✓ A imagem está nítida</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelfiePreview(null);
                      setCapturedFile(null);
                      setDocumentModalStep(2);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Tirar Novamente
                  </button>
                  <button
                    onClick={saveDocument}
                    disabled={uploadingDocument}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploadingDocument ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        Confirmar e Enviar
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            
            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}

      {/* Selfie Modal */}
      {showSelfieModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            {/* Step 1: Instructions */}
            {selfieStep === 1 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📸 Como tirar uma boa selfie</h3>
                  <button
                    onClick={closeSelfieModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Boa iluminação</div>
                      <div className="text-sm text-blue-700">Tire a foto em um ambiente bem iluminado, de preferência com luz natural</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Rosto visível</div>
                      <div className="text-sm text-blue-700">Seu rosto deve estar completamente visível, sem óculos escuros ou chapéus</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Fundo neutro</div>
                      <div className="text-sm text-blue-700">Prefira um fundo claro e sem distrações</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <div className="font-medium text-blue-900">Expressão natural</div>
                      <div className="text-sm text-blue-700">Mantenha uma expressão neutra, similar à de documentos oficiais</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeSelfieModal}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setSelfieStep(2)}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Camera or File Upload */}
            {selfieStep === 2 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">📸 Tirar Selfie</h3>
                  <button
                    onClick={closeSelfieModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {!useCamera ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setUseCamera(true);
                        startCamera();
                      }}
                      className="w-full p-6 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                    >
                      <Camera size={40} className="mx-auto text-indigo-600 mb-2" />
                      <div className="font-medium text-gray-900">Usar Câmera</div>
                      <div className="text-sm text-gray-600 mt-1">Tire uma foto agora</div>
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou</span>
                      </div>
                    </div>

                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelfieFileSelect}
                        className="hidden"
                      />
                      <div className="w-full p-6 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
                        <Upload size={40} className="mx-auto text-indigo-600 mb-2" />
                        <div className="font-medium text-gray-900">Enviar Arquivo</div>
                        <div className="text-sm text-gray-600 mt-1">Escolha uma foto da galeria</div>
                      </div>
                    </label>

                    <button
                      onClick={() => setSelfieStep(1)}
                      className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Voltar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setUseCamera(false);
                          stopCamera();
                        }}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Camera size={20} />
                        Capturar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Preview and Confirm */}
            {selfieStep === 3 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">📸 Confirmar Selfie</h3>
                  <button
                    onClick={closeSelfieModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    {selfiePreview && (
                      <img
                        src={selfiePreview}
                        alt="Preview"
                        className="w-full"
                      />
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                      <div className="text-sm text-amber-800">
                        <div className="font-medium mb-1">Verifique sua foto</div>
                        <ul className="space-y-1 text-xs">
                          <li>✓ Rosto bem iluminado e visível</li>
                          <li>✓ Imagem nítida e sem tremor</li>
                          <li>✓ Fundo neutro e sem distrações</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelfiePreview(null);
                      setCapturedFile(null);
                      setSelfieStep(2);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Tirar Novamente
                  </button>
                  <button
                    onClick={saveSelfie}
                    disabled={uploadingDocument}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploadingDocument ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Confirmar e Enviar
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
};

