import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { client } from '@/sanity/client';
export async function GET(request: Request) {
  if (!process.env.SANITY_API_READ_TOKEN)
    return new Response(
      'Pré-visualização ainda não configurada. Adicione SANITY_API_READ_TOKEN no servidor.',
      { status: 503 },
    );
  const { GET: enable } = defineEnableDraftMode({
    client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
  });
  return enable(request);
}
