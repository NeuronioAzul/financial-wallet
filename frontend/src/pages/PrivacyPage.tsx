import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserX } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-ocean-blue/10 p-3">
              <Shield className="h-8 w-8 text-ocean-blue" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Política de Privacidade</h1>
            </div>
          </div>
          <p className="text-gray-600 mb-8">Última atualização: 17 de novembro de 2025</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-700">
              <strong>Compromisso com sua privacidade:</strong> Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsável pelo Tratamento</h2>
              <p className="mb-4">
                O Grupo Adriano Cobuccio, inscrito sob o CNPJ 00.000.000/0001-00, com sede em São Paulo/SP, é o controlador dos dados pessoais tratados através da plataforma Financial Wallet.
              </p>
              <p className="mb-4">
                <strong>Encarregado de Dados (DPO):</strong> dpo@grupoadrianocobuccio.com.br
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-ocean-blue" />
                2. Dados Coletados
              </h2>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1. Dados Pessoais</h3>
                <p className="mb-2">Coletamos os seguintes dados pessoais quando você cria uma conta:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>CPF (Cadastro de Pessoa Física)</li>
                  <li>Telefone (opcional)</li>
                  <li>Data de nascimento</li>
                  <li>Endereço residencial</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2. Documentos</h3>
                <p className="mb-2">Para verificação de identidade, solicitamos:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Foto do usuário</li>
                  <li>Documentos de identificação (RG, CNH)</li>
                  <li>Comprovante de residência</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3. Dados de Transações</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Histórico de depósitos e transferências</li>
                  <li>Saldo da carteira</li>
                  <li>Destinatários de transferências</li>
                  <li>Datas e horários das operações</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4. Dados Técnicos</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Endereço IP</li>
                  <li>Informações do dispositivo e navegador</li>
                  <li>Logs de acesso e uso da plataforma</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-ocean-blue" />
                3. Finalidade do Tratamento
              </h2>
              <p className="mb-4">Utilizamos seus dados para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Prestação de serviços:</strong> Criar e gerenciar sua conta, processar transações</li>
                <li><strong>Segurança:</strong> Prevenir fraudes e atividades suspeitas</li>
                <li><strong>Conformidade legal:</strong> Cumprir obrigações regulatórias e legais</li>
                <li><strong>Comunicação:</strong> Enviar notificações sobre sua conta e transações</li>
                <li><strong>Melhoria da plataforma:</strong> Análise de uso para aprimoramento dos serviços</li>
                <li><strong>Suporte:</strong> Atendimento ao cliente e resolução de problemas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal</h2>
              <p className="mb-4">O tratamento dos seus dados pessoais é realizado com base em:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consentimento:</strong> Para coleta de dados cadastrais e documentos</li>
                <li><strong>Execução de contrato:</strong> Para prestação dos serviços financeiros</li>
                <li><strong>Obrigação legal:</strong> Para cumprimento de regulamentações financeiras</li>
                <li><strong>Legítimo interesse:</strong> Para prevenção de fraudes e segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
              <p className="mb-4">
                <strong>5.1.</strong> Não vendemos seus dados pessoais a terceiros.
              </p>
              <p className="mb-4">
                <strong>5.2.</strong> Podemos compartilhar dados com:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Prestadores de serviços (processamento de pagamentos, armazenamento em nuvem)</li>
                <li>Autoridades governamentais quando exigido por lei</li>
                <li>Parceiros de negócios com seu consentimento explícito</li>
              </ul>
              <p className="mb-4">
                <strong>5.3.</strong> Todos os terceiros são contratualmente obrigados a proteger seus dados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-ocean-blue" />
                6. Segurança dos Dados
              </h2>
              <p className="mb-4">Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Criptografia de dados em trânsito (HTTPS/TLS) e em repouso</li>
                <li>Autenticação segura com tokens (Laravel Sanctum)</li>
                <li>Controle de acesso baseado em funções</li>
                <li>Auditoria e registro de todas as operações</li>
                <li>Backups regulares e recuperação de desastres</li>
                <li>Testes de segurança periódicos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Armazenamento e Retenção</h2>
              <p className="mb-4">
                <strong>7.1.</strong> Seus dados são armazenados em servidores seguros localizados no Brasil.
              </p>
              <p className="mb-4">
                <strong>7.2.</strong> Mantemos seus dados pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Prestação dos serviços enquanto sua conta estiver ativa</li>
                <li>Cumprimento de obrigações legais (mínimo de 5 anos para dados financeiros)</li>
                <li>Resolução de disputas e exercício de direitos legais</li>
              </ul>
              <p className="mb-4">
                <strong>7.3.</strong> Após o período de retenção, os dados são anonimizados ou excluídos de forma segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserX className="h-6 w-6 text-ocean-blue" />
                8. Seus Direitos (LGPD)
              </h2>
              <p className="mb-4">De acordo com a LGPD, você tem direito a:</p>
              <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                <div>
                  <strong className="text-gray-900">Confirmação e acesso:</strong>
                  <p className="text-sm mt-1">Saber se tratamos seus dados e solicitar cópia deles</p>
                </div>
                <div>
                  <strong className="text-gray-900">Correção:</strong>
                  <p className="text-sm mt-1">Atualizar dados incompletos, inexatos ou desatualizados</p>
                </div>
                <div>
                  <strong className="text-gray-900">Anonimização, bloqueio ou eliminação:</strong>
                  <p className="text-sm mt-1">Solicitar anonimização ou exclusão de dados desnecessários</p>
                </div>
                <div>
                  <strong className="text-gray-900">Portabilidade:</strong>
                  <p className="text-sm mt-1">Receber seus dados em formato estruturado e interoperável</p>
                </div>
                <div>
                  <strong className="text-gray-900">Revogação do consentimento:</strong>
                  <p className="text-sm mt-1">Retirar seu consentimento a qualquer momento</p>
                </div>
                <div>
                  <strong className="text-gray-900">Informação sobre compartilhamento:</strong>
                  <p className="text-sm mt-1">Saber com quem compartilhamos seus dados</p>
                </div>
                <div>
                  <strong className="text-gray-900">Oposição:</strong>
                  <p className="text-sm mt-1">Opor-se ao tratamento em determinadas situações</p>
                </div>
              </div>
              <p className="mt-4">
                Para exercer seus direitos, entre em contato através do e-mail: <strong>dpo@grupoadrianocobuccio.com.br</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <p className="mb-4">
                <strong>9.1.</strong> Utilizamos cookies e tecnologias similares para melhorar sua experiência.
              </p>
              <p className="mb-4">
                <strong>9.2.</strong> Tipos de cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong>Essenciais:</strong> Necessários para o funcionamento da plataforma</li>
                <li><strong>Funcionais:</strong> Lembram suas preferências (tema, idioma)</li>
                <li><strong>Analíticos:</strong> Ajudam a entender como você usa a plataforma</li>
              </ul>
              <p className="mb-4">
                <strong>9.3.</strong> Você pode gerenciar cookies através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Menores de Idade</h2>
              <p className="mb-4">
                Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se descobrirmos que coletamos dados de um menor, tomaremos medidas para excluí-los imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Alterações nesta Política</h2>
              <p className="mb-4">
                <strong>11.1.</strong> Podemos atualizar esta Política periodicamente para refletir mudanças em nossas práticas ou na legislação.
              </p>
              <p className="mb-4">
                <strong>11.2.</strong> Notificaremos você sobre alterações significativas por e-mail ou através da plataforma.
              </p>
              <p className="mb-4">
                <strong>11.3.</strong> A versão atualizada terá uma nova data de "Última atualização".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contato</h2>
              <p className="mb-4">
                Para dúvidas, solicitações ou reclamações sobre privacidade e proteção de dados:
              </p>
              <div className="bg-ocean-blue/5 rounded-xl p-6 space-y-2">
                <p><strong>Encarregado de Dados (DPO):</strong></p>
                <p>📧 <strong>Email:</strong> dpo@grupoadrianocobuccio.com.br</p>
                <p>📞 <strong>Telefone:</strong> (11) 0000-0000</p>
                <p>📍 <strong>Endereço:</strong> São Paulo/SP</p>
              </div>
              <p className="mt-4 text-sm">
                Você também pode registrar uma reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD) em caso de violação de seus direitos.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Ao utilizar a Financial Wallet, você reconhece que leu, compreendeu e concordou com esta Política de Privacidade.
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
