import { useState, useEffect, useRef, memo, useCallback } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const OptimizedImage = memo(
  ({ src, alt, className = "" }: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "20px" }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
    if (!src || !isInView || isLoaded || error) return;
    
    let isCancelled = false;
    const img = new Image();
    
    img.onload = () => {
      if (!isCancelled) {
        setIsLoaded(true);
        setError(false);
      }
    };

    img.onerror = () => {
      if (!isCancelled) {
        setError(true);
        setIsLoaded(true);
      }
    };
    
    img.src = src;
    
    return () => {
      isCancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView, isLoaded, error]);

    if (error) {
      return (
        <div
          ref={imgRef}
          className={`bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${className}`}
        >
          <div className="text-gray-400 text-2xl mb-2">📷</div>
          <span className="text-gray-500 text-xs text-center px-2">
            Imagem não disponível
          </span>
        </div>
      );
    }
    return (
      <div ref={imgRef} className="relative h-full">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {isInView && (
          <img
            src={src}
            alt={alt}
            className={`${className} ${
              isLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500 h-full w-full`}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    );
  }
);

export default OptimizedImage;
