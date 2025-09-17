const videoPresentation =
  "https://firebasestorage.googleapis.com/v0/b/database-img/o/Video_Apresentacao.mov?alt=media";

import { useState, useEffect, useRef } from "react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [hasBeenHidden, setHasBeenHidden] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (hasBeenHidden) return;

      const filtersElement = document.querySelector('#filters');

      if (filtersElement) {
        const rect = filtersElement.getBoundingClientRect();
        if (rect.top <= 0) {
          setIsHidden(true);
          setHasBeenHidden(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasBeenHidden]);



  const handleVideoLoad = () => {
    setIsLoaded(true);
    setLoadError(false);
  };

  const handleVideoError = () => {
    setLoadError(true);
    setIsLoaded(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] xs:min-h-[30vh] md:min-h-[80vh] flex items-center justify-center py-8 xs:py-0 md:py-12 px-4 xs:px-0 md:px-4 mt-8 xs:mt-4 md:mt-12"
      style={{ display: isHidden ? 'none' : 'flex' }}
      id="hero-section"
    >
      <div className="w-full max-w-6xl xs:w-[85%] xs:px-0 md:max-w-6xl mx-auto">
        <div className="relative aspect-video xs:aspect-[16/10] md:aspect-video overflow-hidden rounded-3xl xs:rounded-2xl md:rounded-[2rem] transition-all duration-700 transform hover:scale-[1.02] xs:pb-12 md:pb-0">
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center z-10">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-sm opacity-75">
                Carregando vídeo...
              </p>
              <div className="w-48 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          )}
          {loadError && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center z-10">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <p className="text-white text-sm text-center px-4">
                Erro ao carregar o vídeo. Verifique sua conexão.
              </p>
            </div>
          )}
          {isInView && (
            <video
              ref={videoRef}
              src={videoPresentation}
              autoPlay
              muted
              loop
              playsInline
              className={`w-full h-full xs:object-fill md:object-contain transition-opacity duration-500 ${isLoaded && !loadError ? "opacity-100" : "opacity-0"
                }`}
              controls
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              preload="metadata"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
