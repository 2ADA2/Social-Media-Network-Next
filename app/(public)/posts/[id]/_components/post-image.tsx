"use client";

import { useState } from "react";
import Image from "next/image";

const DEFAULT_IMAGE = "/assets/default-image.png";

interface PostImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  loading?: "eager" | "lazy" | undefined;
}

export const PostImage = ({
  src,
  alt,
  width = 1920,
  height = 1080,
  className,
  loading,
}: PostImageProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? DEFAULT_IMAGE : src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
