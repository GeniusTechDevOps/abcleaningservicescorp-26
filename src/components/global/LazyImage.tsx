import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  height?: number;
  className: string;
  imgLoading?: "eager" | "lazy";
  priority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  height,
  className,
  imgLoading,
  priority = false,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (imgRef.current) {
              imgRef.current.src = src;
              setIsLoading(false);
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, priority]);

  return (
    <img
      ref={imgRef}
      src={isLoading ? "/assets/img/PlaceholderBlur.webp" : src}
      alt={alt}
      height={height}
      className={className}
      loading={priority ? "eager" : imgLoading || "lazy"}
      {...(priority ? { fetchpriority: "high" } : {}) as any} // 👈 Esto evita el error TS
      {...rest}
    />
  );
};

export default LazyImage;
