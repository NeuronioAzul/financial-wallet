import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  Info,
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RotateCcw,
  Mail,
  Lock,
  User,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const StyleGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-oceanblue mb-2">
            Design System
          </h1>
          <p className="text-charcoalgray">
            Guia de estilos e componentes - Adriano Cobuccio
          </p>
        </div>

        {/* Colors */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">Cores</h2>

          <div className="space-y-6">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Cores Principais</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-24 bg-oceanblue rounded-lg mb-2"></div>
                  <p className="font-medium">Ocean Blue</p>
                  <p className="text-sm text-gray-600">#003161</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-oceanblue
                  </code>
                </div>
                <div>
                  <div className="h-24 bg-royalblue rounded-lg mb-2"></div>
                  <p className="font-medium">Royal Blue</p>
                  <p className="text-sm text-gray-600">#3D58B6</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-royalblue
                  </code>
                </div>
                <div>
                  <div className="h-24 bg-forestgreen rounded-lg mb-2"></div>
                  <p className="font-medium">Forest Green</p>
                  <p className="text-sm text-gray-600">#00610D</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-forestgreen
                  </code>
                </div>
                <div>
                  <div className="h-24 bg-mintgreen rounded-lg mb-2"></div>
                  <p className="font-medium">Mint Green</p>
                  <p className="text-sm text-gray-600">#70E080</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-mintgreen
                  </code>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Cores de Acento</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-24 bg-goldensand rounded-lg mb-2"></div>
                  <p className="font-medium">Golden Sand</p>
                  <p className="text-sm text-gray-600">#DAB655</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-goldensand
                  </code>
                </div>
                <div>
                  <div className="h-24 bg-burgundyred rounded-lg mb-2"></div>
                  <p className="font-medium">Burgundy Red</p>
                  <p className="text-sm text-gray-600">#610019</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-burgundyred
                  </code>
                </div>
                <div>
                  <div className="h-24 bg-silvergray rounded-lg mb-2"></div>
                  <p className="font-medium">Silver Gray</p>
                  <p className="text-sm text-gray-600">#B3B6CA</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-silvergray
                  </code>
                </div>
                <div>
                  <div className="h-24 bg-charcoalgray rounded-lg mb-2"></div>
                  <p className="font-medium">Charcoal Gray</p>
                  <p className="text-sm text-gray-600">#686A75</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    bg-charcoalgray
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">Tipografia</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Heading 1 - 4xl Bold
              </h1>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-4xl font-bold
              </code>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Heading 2 - 3xl Bold
              </h2>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-3xl font-bold
              </code>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Heading 3 - 2xl Bold
              </h3>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-2xl font-bold
              </code>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">
                Heading 4 - xl Semibold
              </h4>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-xl font-semibold
              </code>
            </div>
            <div>
              <p className="text-lg text-gray-900">Body Large - lg Regular</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-lg
              </code>
            </div>
            <div>
              <p className="text-base text-gray-900">
                Body Regular - base Regular
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-base
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600">Body Small - sm Gray</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-sm text-gray-600
              </code>
            </div>
            <div>
              <p className="text-xs text-gray-500">Caption - xs Gray</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                text-xs text-gray-500
              </code>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">Botões</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Tamanhos e Estilos</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-goldensand text-gray-900 font-bold hover:bg-goldensand-dark">
                  Golden Sand
                </Button>
                <Button className="bg-oceanblue text-white hover:bg-oceanblue-light">
                  Ocean Blue
                </Button>
                <Button className="bg-forestgreen text-white hover:bg-forestgreen-light">
                  Forest Green
                </Button>
                <Button className="border-2 border-oceanblue text-oceanblue hover:bg-oceanblue hover:text-white">
                  Outline
                </Button>
                <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                  Secondary
                </Button>
                <Button className="bg-burgundyred text-white hover:bg-burgundyred-light">
                  Danger
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Com Ícones</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-goldensand text-gray-900 font-bold hover:bg-goldensand-dark">
                  <Plus size={20} />
                  Depositar
                </Button>
                <Button className="bg-oceanblue text-white hover:bg-oceanblue-light">
                  <ArrowUpRight size={20} />
                  Transferir
                </Button>
                <Button className="border-2 border-oceanblue text-oceanblue hover:bg-oceanblue hover:text-white">
                  <RotateCcw size={20} />
                  Estornar
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Estados</h3>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-goldensand text-gray-900 font-bold">
                  Normal
                </Button>
                <Button
                  className="bg-goldensand text-gray-900 font-bold opacity-50 cursor-not-allowed"
                  disabled
                >
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Form Elements */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">
            Formulários
          </h2>
          <div className="space-y-6 max-w-md">
            <div>
              <h3 className="text-lg font-semibold mb-3">Inputs</h3>
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  icon={<Mail size={20} />}
                />
                <Input
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={20} />}
                />
                <Input
                  label="Nome"
                  type="text"
                  placeholder="João da Silva"
                  icon={<User size={20} />}
                />
                <Input
                  label="Com Erro"
                  type="text"
                  placeholder="Campo obrigatório"
                  error="Este campo é obrigatório"
                />
                <Input
                  label="Desabilitado"
                  type="text"
                  placeholder="Campo desabilitado"
                  disabled
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Select</h3>
              <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-royalblue focus:ring-2 focus:ring-royalblue/20 outline-none">
                <option>Selecione uma opção</option>
                <option>Opção 1</option>
                <option>Opção 2</option>
                <option>Opção 3</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Checkbox e Radio</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-oceanblue focus:ring-oceanblue"
                  />
                  <span className="text-sm">Checkbox option</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="example"
                    className="h-4 w-4 border-gray-300 text-oceanblue focus:ring-oceanblue"
                  />
                  <span className="text-sm">Radio option 1</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="example"
                    className="h-4 w-4 border-gray-300 text-oceanblue focus:ring-oceanblue"
                  />
                  <span className="text-sm">Radio option 2</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Icons */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">Ícones</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Transações</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-mintgreen/10 flex items-center justify-center">
                    <Plus size={24} className="text-mintgreen" />
                  </div>
                  <p className="text-sm">Depósito</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-royalblue/10 flex items-center justify-center">
                    <ArrowUpRight size={24} className="text-royalblue" />
                  </div>
                  <p className="text-sm">Enviado</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-mintgreen/10 flex items-center justify-center">
                    <ArrowDownLeft size={24} className="text-mintgreen" />
                  </div>
                  <p className="text-sm">Recebido</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-goldensand/10 flex items-center justify-center">
                    <RotateCcw size={24} className="text-goldensand" />
                  </div>
                  <p className="text-sm">Estorno</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-oceanblue/10 flex items-center justify-center">
                    <Wallet size={24} className="text-oceanblue" />
                  </div>
                  <p className="text-sm">Carteira</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-forestgreen/10 flex items-center justify-center">
                    <Check size={24} className="text-forestgreen" />
                  </div>
                  <p className="text-sm">Sucesso</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-burgundyred/10 flex items-center justify-center">
                    <X size={24} className="text-burgundyred" />
                  </div>
                  <p className="text-sm">Erro</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-goldensand/10 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-goldensand" />
                  </div>
                  <p className="text-sm">Aviso</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-royalblue/10 flex items-center justify-center">
                    <Info size={24} className="text-royalblue" />
                  </div>
                  <p className="text-sm">Info</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-forestgreen/10 text-forestgreen text-sm font-medium">
              Concluída
            </span>
            <span className="px-3 py-1 rounded-full bg-goldensand/20 text-goldensand-dark text-sm font-medium">
              Pendente
            </span>
            <span className="px-3 py-1 rounded-full bg-burgundyred/10 text-burgundyred text-sm font-medium">
              Falhou
            </span>
            <span className="px-3 py-1 rounded-full bg-silvergray text-charcoalgray text-sm font-medium">
              Estornada
            </span>
            <span className="px-3 py-1 rounded-full bg-oceanblue/10 text-oceanblue text-sm font-medium">
              Cliente
            </span>
            <span className="px-3 py-1 rounded-full bg-royalblue/20 text-royalblue-dark text-sm font-medium">
              Admin
            </span>
          </div>
        </Card>

        {/* Cards */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">Cards</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-lg font-semibold mb-2">Card Padrão</h3>
              <p className="text-gray-600">
                Este é um card com o estilo padrão do sistema.
              </p>
            </Card>
            <Card className="bg-gradient-to-br from-oceanblue to-royalblue text-white">
              <h3 className="text-lg font-semibold mb-2">Card com Gradiente</h3>
              <p className="text-white/80">Card com gradiente azul oceano.</p>
            </Card>
          </div>
        </Card>

        {/* Table */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-oceanblue mb-4">Tabela</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">001</td>
                  <td className="py-3 px-4">João Silva</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-forestgreen/10 text-forestgreen text-xs">
                      Ativo
                    </span>
                  </td>
                  <td className="py-3 px-4 text-forestgreen font-semibold">
                    R$ 1.000,00
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">002</td>
                  <td className="py-3 px-4">Maria Santos</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-goldensand/20 text-goldensand-dark text-xs">
                      Pendente
                    </span>
                  </td>
                  <td className="py-3 px-4 text-charcoalgray font-semibold">
                    R$ 500,00
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">003</td>
                  <td className="py-3 px-4">Pedro Costa</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-burgundyred/10 text-burgundyred text-xs">
                      Inativo
                    </span>
                  </td>
                  <td className="py-3 px-4 text-burgundyred font-semibold">
                    -R$ 200,00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
