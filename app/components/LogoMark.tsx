/**
 * The mark on its own, lifted from the PVA Media lockup: identical path,
 * isolated so the intro animation can assemble the wordmark letter by letter
 * around it.
 */
export default function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={className}
      aria-hidden
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(2.8125,0,0,2.8125,0,0)">
        <path d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16zM14.817 6.421h2v8.886h8.887v2H14.817V6.421zm-5.959.437h2v14.283h14.283v2H8.858V6.858z" />
      </g>
    </svg>
  );
}
