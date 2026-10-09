import { z } from 'zod';
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(100),
  replyTo: z
    .string()
    .trim()
    .min(5, 'Informe seu e-mail ou WhatsApp.')
    .max(150)
    .refine(
      (value) => z.email().safeParse(value).success || /^\+?[\d\s()-]{10,25}$/.test(value),
      'Informe um e-mail ou WhatsApp válido.',
    ),
  message: z
    .string()
    .trim()
    .min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.')
    .max(4000),
  website: z.string().max(0).optional(),
});
export function deliverableEmail(value?: string) {
  return Boolean(
    value &&
    z.email().safeParse(value).success &&
    !/@(example\.(com|org|net)|.*\.invalid)$/i.test(value),
  );
}
export function mailtoMessage(
  email: string,
  data: { name: string; replyTo: string; message: string },
) {
  return `mailto:${email}?subject=${encodeURIComponent('Contato pelo site — ' + data.name)}&body=${encodeURIComponent(`Nome: ${data.name}\nRetorno: ${data.replyTo}\n\n${data.message}`)}`;
}
