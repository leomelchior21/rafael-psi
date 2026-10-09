import { ImageResponse } from 'next/og';
export const alt = 'Rafael Rodrigues — Psicanálise, cidade e palavra';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        background: '#061827',
        color: '#f2efe7',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 2 }}>RAFAEL RODRIGUES</div>
      <div
        style={{
          fontFamily: 'serif',
          fontSize: 94,
          lineHeight: 1.05,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span>Psicanálise,</span>
        <span>cidade e palavra.</span>
      </div>
      <div style={{ fontSize: 24 }}>Escuta, pensamento e vida urbana.</div>
    </div>,
    size,
  );
}
