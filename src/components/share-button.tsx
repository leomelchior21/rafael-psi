'use client';
import { useState } from 'react';
export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState('');
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: location.href });
      } else {
        await navigator.clipboard.writeText(location.href);
        setStatus('Link copiado.');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError')
        setStatus('Copie o endereço desta página para compartilhar.');
    }
  }
  return (
    <div className="share-control">
      <button className="text-link" onClick={share}>
        Compartilhar ↗
      </button>
      <span role="status" className="meta">
        {status}
      </span>
    </div>
  );
}
