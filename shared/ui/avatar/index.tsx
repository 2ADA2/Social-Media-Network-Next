import Image from 'next/image';
import './avatar.css';
import React, { useState } from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string;
  size: number;
  alt?: string;
  className?: string;
}

export const DEFAULT_AVATAR = '/assets/default-avatar.jpg';

export const Avatar = ({
  src,
  size,
  alt,
  className = '',
  ...props
}: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <Image
      src={hasError || !src ? DEFAULT_AVATAR : src}
      className={'avatar ' + className}
      alt={alt || 'avatar'}
      width={size}
      height={size}
      {...props}
      onError={handleError}
    />
  );
};
