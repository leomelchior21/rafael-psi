import test from 'node:test';
import assert from 'node:assert/strict';
import { contactSchema, deliverableEmail, mailtoMessage } from '../src/lib/contact';
import { safeHref, whatsappUrl, normalize, jsonLd } from '../src/lib/utils';
test('contact accepts email or WhatsApp and rejects malformed or automated submissions', () => {
  const data = {
    name: 'Maria',
    replyTo: 'maria@example.org',
    message: 'Gostaria de conversar sobre os horários.',
    website: '',
  };
  assert.equal(contactSchema.safeParse(data).success, true);
  assert.equal(contactSchema.safeParse({ ...data, replyTo: '+55 11 99999-9999' }).success, true);
  assert.equal(contactSchema.safeParse({ ...data, replyTo: 'not-an-address' }).success, false);
  assert.equal(contactSchema.safeParse({ ...data, website: 'spam' }).success, false);
  assert.equal(contactSchema.safeParse({ ...data, message: 'x'.repeat(4001) }).success, false);
  assert.equal(deliverableEmail('lorem@example.com'), false);
});
test('editor-provided links cannot execute scripts', () => {
  assert.equal(safeHref('javascript:alert(1)'), undefined);
  assert.equal(safeHref('//evil.example'), undefined);
  assert.equal(safeHref('/textos'), '/textos');
  assert.equal(safeHref('https://example.com'), 'https://example.com');
});
test('search normalizes Portuguese diacritics and WhatsApp includes international code', () => {
  assert.equal(normalize('Clínica, repetição'), 'clinica, repeticao');
  assert.equal(whatsappUrl('+55 (11) 99999-9999'), 'https://wa.me/5511999999999');
  assert.equal(whatsappUrl('loremipsum'), undefined);
});
test('shareable data is escaped and mailto preserves Portuguese without header injection', () => {
  assert.ok(!jsonLd({ title: '</script><script>' }).includes('<'));
  assert.ok(
    mailtoMessage('test@example.com', {
      name: 'João',
      replyTo: 'x@example.com',
      message: 'Olá & até já',
    }).includes('Ol%C3%A1%20%26'),
  );
});
