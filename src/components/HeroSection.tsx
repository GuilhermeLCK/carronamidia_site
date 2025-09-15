// import videoPresentation from "@/assets/Video_Apresentacao.mov";
const videoPresentation = "https://firebasestorage.googleapis.com/v0/b/database-img/o/Video_Apresentacao.mov?alt=media";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl xs:max-w-lg md:max-w-6xl mx-auto">
        <div className="relative aspect-video xs:aspect-[9/16] md:aspect-video overflow-hidden rounded-lg transition-all duration-700 transform hover:scale-[1.02]">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <video
            src={videoPresentation}
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full xs:object-cover md:object-contain ${
              isLoaded ? "opacity-100" : "opacity-01"
            } transition-opacity duration-500`}
            controls
            onLoadedData={() => setIsLoaded(true)}
            preload="auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
