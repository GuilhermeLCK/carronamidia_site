const videoPresentation =
  "https://firebasestorage.googleapis.com/v0/b/database-img/o/Video_Apresentacao.mov?alt=media";

import { useState, useEffect, useRef } from "react";
import { Instagram, MessageCircle, MapPin } from "lucide-react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
      className="relative min-h-[70vh] xs:min-h-[35vh] md:min-h-[80vh] flex items-center justify-center py-8 xs:py-0 md:py-12 px-4 xs:px-0 md:px-4 mt-8 xs:mt-4 md:mt-12"
    >
      <div className="w-full max-w-6xl xs:w-[85%] xs:px-0 md:max-w-6xl mx-auto">
        <div className="relative aspect-video xs:aspect-[16/10] md:aspect-video overflow-hidden rounded-lg xs:rounded-none md:rounded-xl transition-all duration-700 transform hover:scale-[1.02] xs:pb-12 md:pb-0">
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

        <div className="mt-6 xs:mt-4 md:mt-12">
          <div className="bg-gradient-to-r from-background/80 to-muted/20 backdrop-blur-sm rounded-xl xs:rounded-lg p-6 xs:p-4 border border-border/50">
            <h3 className="text-xl xs:text-lg font-semibold text-center mb-6 xs:mb-4">
              Entre em Contato
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-2">
              <div className="flex flex-col xs:flex-col items-center justify-center gap-2 xs:gap-1 p-3 xs:p-2 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                <Instagram className="h-5 w-5 xs:h-4 xs:w-4 text-pink-600" />
                <a
                  href="https://instagram.com/parisdakarrepasse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs xs:text-[10px] font-medium hover:text-primary transition-colors text-center leading-tight"
                >
                  @parisdakarrepasse
                </a>
              </div>

              <div className="flex flex-col xs:flex-col items-center justify-center gap-2 xs:gap-1 p-3 xs:p-2 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                <Instagram className="h-5 w-5 xs:h-4 xs:w-4 text-pink-600" />
                <a
                  href="https://instagram.com/carronamidia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs xs:text-[10px] font-medium hover:text-primary transition-colors text-center leading-tight"
                >
                  @carronamidia
                </a>
              </div>

              <div className="flex flex-col xs:flex-col items-center justify-center gap-2 xs:gap-1 p-3 xs:p-2 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                <MessageCircle className="h-5 w-5 xs:h-4 xs:w-4 text-green-600" />
                <a
                  href="https://wa.me/5585985114497?text=Olá%20Felipe!%20Vim%20através%20do%20site%20e%20gostaria%20de%20informações%20sobre%20os%20veículos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs xs:text-[10px] font-medium hover:text-primary transition-colors text-center leading-tight"
                >
                  (85) 98511-4497<br />
                  <span className="text-[10px] xs:text-[9px] text-muted-foreground">Felipe Lima</span>
                </a>
              </div>

              <div className="flex flex-col xs:flex-col items-center justify-center gap-2 xs:gap-1 p-3 xs:p-2 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
                <MapPin className="h-5 w-5 xs:h-4 xs:w-4 text-blue-600" />
                <div className="text-center">
                  <div className="text-xs xs:text-[10px] font-medium leading-tight">
                    Av. Rogaciano Leite, 1990
                  </div>
                  <div className="text-[10px] xs:text-[9px] text-muted-foreground leading-tight">
                    Salinas - Fortaleza, Ceará
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
