'use client';
import { useState } from 'react';
import { contactSchema, mailtoMessage } from '@/lib/contact';
import { Arrow } from './icons';
export function ContactForm({
  recipient,
  directDelivery,
}: {
  recipient?: string;
  directDelivery: boolean;
}) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setStatus(parsed.error.issues[0].message);
      return;
    }
    if (!recipient) {
      setStatus('Os dados de contato ainda estão sendo preparados. Nenhuma mensagem foi enviada.');
      return;
    }
    if (!directDelivery) {
      window.location.href = mailtoMessage(recipient, parsed.data);
      setStatus('Conclua o envio no seu aplicativo de e-mail.');
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível enviar.');
      setSent(true);
      setStatus('Mensagem enviada. Obrigado pelo contato.');
      form.reset();
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="contact-form">
      <div className="form-row">
        <label htmlFor="name">
          Nome
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Como você se chama?"
          />
        </label>
        <label htmlFor="replyTo">
          E-mail ou WhatsApp
          <input
            id="replyTo"
            name="replyTo"
            autoComplete="email"
            required
            maxLength={150}
            placeholder="Por onde podemos conversar?"
          />
        </label>
      </div>
      <label htmlFor="message">
        Mensagem
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          placeholder="Escreva algumas palavras…"
          aria-describedby="contact-note"
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p id="contact-note" className="form-note">
        Este primeiro contato não precisa incluir informações de saúde ou outros dados sensíveis.
      </p>
      <div className="form-bottom">
        <button type="submit" className="pill pill-ink" disabled={busy || sent}>
          {busy
            ? 'Enviando…'
            : sent
              ? 'Mensagem enviada'
              : directDelivery
                ? 'Enviar mensagem'
                : 'Preparar mensagem'}
          <Arrow />
        </button>
        <p className="meta">
          {directDelivery
            ? 'Seus dados são usados apenas para responder.'
            : recipient
              ? 'O envio será concluído no seu aplicativo de e-mail.'
              : 'Contato provisório. O envio será habilitado em breve.'}
        </p>
      </div>
      <p role="status" className="form-status">
        {status}
      </p>
    </form>
  );
}
