import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ocean-blue rounded-lg flex items-center justify-center">
                <span className="text-golden-sand font-bold text-lg">AC</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-ocean-blue">Adriano Cobuccio</h1>
                <p className="text-xs text-charcoal-gray">Carteira Digital</p>
              </div>
            </div>

            {/* Back Button */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-royal-blue hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Termos e Condições</h1>
          <p className="text-gray-600 mb-8">Última atualização: 17 de novembro de 2025</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e usar a plataforma Financial Wallet ("Plataforma"), você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definições</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Plataforma:</strong> Sistema de carteira digital Financial Wallet</li>
                <li><strong>Usuário:</strong> Pessoa física que cria conta e utiliza os serviços</li>
                <li><strong>Carteira:</strong> Conta virtual para armazenamento e movimentação de valores</li>
                <li><strong>Transação:</strong> Operação de depósito, transferência ou estorno</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Conta</h2>
              <p className="mb-4">
                <strong>3.1.</strong> Para utilizar a Plataforma, você deve criar uma conta fornecendo informações verdadeiras, completas e atualizadas.
              </p>
              <p className="mb-4">
                <strong>3.2.</strong> Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
              </p>
              <p className="mb-4">
                <strong>3.3.</strong> É obrigatório ter 18 anos ou mais para criar uma conta.
              </p>
              <p className="mb-4">
                <strong>3.4.</strong> Cada usuário pode ter apenas uma conta ativa na Plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso da Plataforma</h2>
              <p className="mb-4">
                <strong>4.1.</strong> Você concorda em usar a Plataforma apenas para fins legais e de acordo com estes Termos.
              </p>
              <p className="mb-4">
                <strong>4.2.</strong> É proibido:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Usar a Plataforma para atividades ilegais ou fraudulentas</li>
                <li>Tentar acessar áreas não autorizadas do sistema</li>
                <li>Interferir no funcionamento da Plataforma</li>
                <li>Compartilhar suas credenciais de acesso</li>
                <li>Realizar operações que violem regulamentações financeiras</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Transações Financeiras</h2>
              <p className="mb-4">
                <strong>5.1.</strong> Todas as transações estão sujeitas a verificação e podem ser canceladas em caso de suspeita de fraude.
              </p>
              <p className="mb-4">
                <strong>5.2.</strong> Os valores depositados ficam disponíveis imediatamente após confirmação.
              </p>
              <p className="mb-4">
                <strong>5.3.</strong> Transferências entre usuários são processadas em tempo real.
              </p>
              <p className="mb-4">
                <strong>5.4.</strong> Estornos podem ser solicitados conforme política específica da Plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacidade e Proteção de Dados</h2>
              <p className="mb-4">
                <strong>6.1.</strong> Seus dados pessoais são tratados conforme nossa Política de Privacidade e a Lei Geral de Proteção de Dados (LGPD).
              </p>
              <p className="mb-4">
                <strong>6.2.</strong> Implementamos medidas de segurança para proteger suas informações.
              </p>
              <p className="mb-4">
                <strong>6.3.</strong> Você tem direito de acessar, corrigir e excluir seus dados pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Responsabilidades e Limitações</h2>
              <p className="mb-4">
                <strong>7.1.</strong> A Plataforma é fornecida "como está" sem garantias de qualquer tipo.
              </p>
              <p className="mb-4">
                <strong>7.2.</strong> Não nos responsabilizamos por:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Interrupções temporárias do serviço para manutenção</li>
                <li>Perdas decorrentes de ações de terceiros</li>
                <li>Danos indiretos ou consequenciais</li>
              </ul>
              <p className="mb-4">
                <strong>7.3.</strong> Você é responsável por manter seus dispositivos seguros e atualizados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Suspensão e Encerramento</h2>
              <p className="mb-4">
                <strong>8.1.</strong> Podemos suspender ou encerrar sua conta se você violar estes Termos.
              </p>
              <p className="mb-4">
                <strong>8.2.</strong> Você pode encerrar sua conta a qualquer momento através das configurações.
              </p>
              <p className="mb-4">
                <strong>8.3.</strong> Ao encerrar a conta, seus dados serão tratados conforme a LGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificações dos Termos</h2>
              <p className="mb-4">
                <strong>9.1.</strong> Reservamos o direito de modificar estes Termos a qualquer momento.
              </p>
              <p className="mb-4">
                <strong>9.2.</strong> Você será notificado sobre alterações significativas.
              </p>
              <p className="mb-4">
                <strong>9.3.</strong> O uso continuado da Plataforma após modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Lei Aplicável</h2>
              <p className="mb-4">
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Quaisquer disputas serão resolvidas no foro da comarca de São Paulo/SP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
              <p className="mb-4">
                Para dúvidas sobre estes Termos, entre em contato:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li><strong>Email:</strong> suporte@grupoadrianocobuccio.com.br</li>
                <li><strong>Telefone:</strong> (11) 0000-0000</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Ao utilizar a Financial Wallet, você reconhece que leu, compreendeu e concordou com estes Termos e Condições.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 Grupo Adriano Cobuccio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
