import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata(
  'Privacidade',
  'Informações sobre o contato e o uso deste site.',
  '/privacidade',
);
export default function PrivacyPage() {
  return (
    <div className="container page-section">
      <div className="page-heading">
        <span className="eyebrow">Informações do site</span>
        <h1>Privacidade</h1>
      </div>
      <div className="reading-column prose">
        <p>
          Este site não solicita informações de saúde. Ao entrar em contato, envie apenas os dados
          necessários para receber uma resposta.
        </p>
        <h2>Mensagens</h2>
        <p>
          Nome, contato e mensagem são usados para responder à sua solicitação. No envio por e-mail
          ou WhatsApp, a mensagem é tratada pelo serviço escolhido. Quando o envio direto estiver
          habilitado, a entrega por e-mail utiliza o serviço Resend. Este site não mantém um banco
          de dados de mensagens.
        </p>
        <h2>Navegação</h2>
        <p>
          Não são instalados cookies de publicidade nem ferramentas de análise de audiência. Os
          serviços de hospedagem e distribuição de conteúdo podem processar registros técnicos, como
          endereço IP, para entregar e proteger as páginas. O acesso ao estúdio de edição utiliza
          autenticação da Sanity.
        </p>
        <h2>Seus dados</h2>
        <p>
          Para solicitar informações ou a exclusão de uma mensagem enviada, utilize o mesmo canal
          pelo qual iniciou o contato. Antes da divulgação pública, o responsável pelo site deverá
          revisar estas informações de acordo com os serviços e procedimentos efetivamente
          utilizados.
        </p>
      </div>
    </div>
  );
}
