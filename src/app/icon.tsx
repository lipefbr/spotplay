import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #059669, #10b981)',
          borderRadius: '96px',
        }}
      >
        {/* Music note icon */}
        <svg
          width="280"
          height="280"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stem */}
          <rect x="82" y="10" width="14" height="90" rx="7" fill="white" />
          {/* Left note head */}
          <ellipse cx="50" cy="100" rx="30" ry="22" fill="white" transform="rotate(-15 50 100)" />
          {/* Right note head */}
          <ellipse cx="102" cy="82" rx="30" ry="22" fill="white" transform="rotate(-15 102 82)" />
          {/* Beam */}
          <rect x="82" y="10" width="50" height="14" rx="7" fill="white" />
          {/* Second stem */}
          <rect x="118" y="10" width="14" height="72" rx="7" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
