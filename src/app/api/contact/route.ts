import { NextResponse } from 'next/server';
import { getContact, getSettings } from '@/lib/content';
import { contactSchema, deliverableEmail } from '@/lib/contact';
const limits = new Map<string, { count: number; reset: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin)
    return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return NextResponse.json({ error: 'Formato inválido.' }, { status: 415 });
  // Bound request bodies before parsing, including chunked requests.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 });
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 20000) {
      await reader.cancel();
      return NextResponse.json({ error: 'Mensagem muito longa.' }, { status: 413 });
    }
    chunks.push(value);
  }
  let input: unknown;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  const [contact, settings] = await Promise.all([getContact(), getSettings()]);
  const recipient = contact.formRecipient || contact.email || settings.email;
  if (
    !contact.formEnabled ||
    !deliverableEmail(recipient) ||
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_FROM_EMAIL
  )
    return NextResponse.json(
      { error: 'O envio direto não está disponível. Use o contato por e-mail.' },
      { status: 503 },
    );
  // Instance-local abuse protection. Configure a shared rate limiter at the hosting edge for multi-instance production.
  const key =
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    'local';
  const now = Date.now();
  for (const [id, value] of limits) {
    if (value.reset < now) limits.delete(id);
  }
  const limit = limits.get(key) || { count: 0, reset: now + 15 * 60 * 1000 };
  if (limit.count >= 4)
    return NextResponse.json(
      { error: 'Aguarde alguns minutos antes de tentar novamente.' },
      { status: 429 },
    );
  limit.count++;
  limits.set(key, limit);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [recipient],
        subject: `Contato pelo site — ${parsed.data.name.replace(/[\r\n]/g, ' ')}`,
        text: `Nome: ${parsed.data.name}\nRetorno: ${parsed.data.replyTo}\n\n${parsed.data.message}`,
        ...(parsed.data.replyTo.includes('@') ? { reply_to: parsed.data.replyTo } : {}),
      }),
    });
    if (!response.ok) throw new Error('Delivery failed');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível enviar agora. Tente novamente ou use o e-mail.' },
      { status: 502 },
    );
  }
}
