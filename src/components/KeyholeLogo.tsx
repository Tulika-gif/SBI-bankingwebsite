import React from 'react';

interface KeyholeLogoProps {
  className?: string;
  size?: number;
  variant?: 'blue' | 'white' | 'deep';
}

export const KeyholeLogo: React.FC<KeyholeLogoProps> = ({
  className = '',
  size = 36,
  variant = 'blue',
}) => {
  const fill =
    variant === 'blue'
      ? '#1458F5'
      : variant === 'deep'
      ? '#082B78'
      : '#FFFFFF';

  const cutout =
    variant === 'white'
      ? '#082B78'
      : '#FFFFFF';

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200"
      >
        {/* Outer Circle */}
        <circle cx="50" cy="50" r="48" fill={fill} />
        {/* Inner Keyhole cutout: circular center + vertical slit reaching down */}
        <path
          d="M 50 28 
             A 14 14 0 0 1 56 53 
             L 54 86 
             L 46 86 
             L 44 53 
             A 14 14 0 0 1 50 28 Z"
          fill={cutout}
        />
      </svg>
    </div>
  );
};
