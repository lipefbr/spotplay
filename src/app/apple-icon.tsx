import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: '36px',
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="82" y="10" width="14" height="90" rx="7" fill="white" />
          <ellipse cx="50" cy="100" rx="30" ry="22" fill="white" transform="rotate(-15 50 100)" />
          <ellipse cx="102" cy="82" rx="30" ry="22" fill="white" transform="rotate(-15 102 82)" />
          <rect x="82" y="10" width="50" height="14" rx="7" fill="white" />
          <rect x="118" y="10" width="14" height="72" rx="7" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
