export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M3 12h17m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
export function SearchIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
