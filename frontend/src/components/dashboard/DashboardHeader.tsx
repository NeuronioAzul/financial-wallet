import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown, FileText, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { clsx } from "clsx";

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: {
        text: "Administrador",
        color: "bg-royal-blue-light/20 text-royal-blue-dark",
      },
      customer: { text: "Cliente", color: "bg-ocean-blue/10 text-ocean-blue" },
    };
    return badges[role as keyof typeof badges] || badges.customer;
  };

  const badge = user ? getRoleBadge(user.role) : null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ocean-blue rounded-lg flex items-center justify-center">
              <span className="text-golden-sand font-bold text-lg">AC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-ocean-blue">
                Adriano Cobuccio
              </h1>
              <p className="text-xs text-charcoal-gray">Carteira Digital</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-ocean-blue flex items-center justify-center text-white font-bold">
                {user && getInitial(user.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                {badge && (
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full",
                      badge.color
                    )}
                  >
                    {badge.text}
                  </span>
                )}
              </div>
              <ChevronDown
                size={20}
                className={clsx(
                  "text-gray-500 transition-transform",
                  isMenuOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User size={16} />
                    Meu Perfil
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Shield size={16} />
                      Painel Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigate("/audit-logs");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Logs de Auditoria
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
