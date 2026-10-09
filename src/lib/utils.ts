export function whatsappUrl(value?: string) {
  const digits = value?.replace(/\D/g, '');
  return digits && digits.length >= 10 && digits.length <= 15
    ? `https://wa.me/${digits}`
    : undefined;
}
export function safeHref(value?: string) {
  if (!value) return undefined;
  if (/^\/(?!\/)/.test(value) || /^#/.test(value)) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}
export function dateLabel(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value));
}
export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
