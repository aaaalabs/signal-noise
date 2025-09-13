export default function BrandIcon() {
  return (
    <div
      className="brand-icon"
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '20px',
        height: '20px',
        opacity: 0,
        animation: 'fadeInBrand 2s ease-out 1s forwards',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 554 558"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 557V1H553V317.562L312.41 557H1Z"
          fill="none"
          stroke="rgba(0, 255, 136, 0.15)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <style>{`
        @keyframes fadeInBrand {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}