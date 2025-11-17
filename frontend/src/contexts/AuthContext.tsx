import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authService } from '@/services';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('wallet_token');
      const savedUser = localStorage.getItem('wallet_user');

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          // Opcionalmente, revalidar com o backend
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('wallet_user', JSON.stringify(profile));
        } catch (error) {
          localStorage.removeItem('wallet_token');
          localStorage.removeItem('wallet_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      console.log('Attempting login...');
      const response = await authService.login(data);
      console.log('Login response received:', response);
      console.log('User roles from backend:', response.user.roles);
      localStorage.setItem('wallet_token', response.token);
      localStorage.setItem('wallet_user', JSON.stringify(response.user));
      setUser(response.user);
      console.log('User state updated:', response.user);
      toast.success('Login realizado com sucesso!');
    } catch (error: unknown) {
      console.error('Login failed:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('wallet_token', response.token);
      localStorage.setItem('wallet_user', JSON.stringify(response.user));
      setUser(response.user);
      toast.success('Conta criada com sucesso!');
    } catch (error: unknown) {
      toast.error('Erro ao criar conta. Tente novamente.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('wallet_token');
      localStorage.removeItem('wallet_user');
      setUser(null);
      toast.success('Logout realizado com sucesso!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
