import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Settings, Star, Truck, Shield, Eye, Heart } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import OptimizedImage from "./OptimizedImage";
import { generateCarLink } from "@/utils/urlUtils";

export interface ProcessedImage {
  base64?: string;
  url?: string;
  originalName: string;
  size: number;
  type: string;
  storageRef?: string;
}

export interface Car {
  id: string;
  title: string;
  description?: string;
  link?: string;
  images: ProcessedImage[];
  active: boolean;
  updatedAt: any;
  year?: number;
  km?: number;
  inPreparation?: boolean;
  plate?: string;
  isConsignment?: boolean;
  isZeroKm?: boolean;
  inTransit?: boolean;
  price?: string;
  isSemiNovo?: boolean;
  codeVehicle?: string;
  isShielding?: boolean;
  category?: string;
  color?: string;
  observation?: string;
  technicalSheet?: string;
  typeOfArmor?: string;
  yearModel?: string;
  brand?: string;
  model?: string;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  featured?: boolean;
}

interface CarCardProps {
  car: Car;
  favoritesManager?: {
    toggleLocalFavorite: (carId: string) => void;
    isLocalFavorite: (carId: string) => boolean;
    getLocalFavoritesCars: (cars: any[]) => any[];
    localFavorites: Set<string>;
  };
}

const CarCard = memo(function CarCard({ car, favoritesManager }: CarCardProps) {
  const formatCurrency = useCallback((value: string | number): string => {
    try {
      if (!value || value === "" || value === "0") return "Consulte";

      const numericValue =
        typeof value === "string"
          ? parseFloat(value.replace(/[^\d,.-]/g, "").replace(",", "."))
          : value;

      if (isNaN(numericValue) || numericValue <= 0) return "Consulte";

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
    } catch (error) {
      console.warn("Erro ao formatar moeda:", error);
      return "Consulte";
    }
  }, []);

  const isRecentlyAdded = useMemo((): boolean => {
    try {
      if (!car.updatedAt) return false;

      const updatedDate = car.updatedAt.toDate
        ? car.updatedAt.toDate()
        : new Date(car.updatedAt);
      const now = new Date();
      const timeDifference = Math.abs(now.getTime() - updatedDate.getTime());
      const hoursDifference = timeDifference / (1000 * 3600);
      return hoursDifference <= 24;
    } catch {
      return false;
    }
  }, [car.updatedAt]);

  const firstImageUrl = useMemo(() => {
    if (!car.images || car.images.length === 0) return "/placeholder.svg";
    const firstImage = car.images[0];
    if (typeof firstImage === "string") return firstImage;
    return firstImage.url || firstImage.base64 || "/placeholder.svg";
  }, [car.images]);

  const handleToggleFavorite = useCallback(() => {
    if (favoritesManager) {
      favoritesManager.toggleLocalFavorite(car.id);
    }
  }, [favoritesManager, car.id]);

  const isFavorite = useMemo(() => {
    return favoritesManager?.isLocalFavorite(car.id) || false;
  }, [favoritesManager, car.id]);

  return (
    <Card
      className={`group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col xs:flex-row md:flex-col ${(() => {
        const tags = [
          car.isShielding && "Blindado",
          car.isZeroKm && "Zero KM",
          car.isConsignment && "Repasse",
          car.inPreparation && "Em Preparação",
          car.isSemiNovo && "Semi novo",
        ].filter(Boolean);
        if (tags.length >= 3) return "xs:h-36";
        if (tags.length === 1) return "xs:h-28";
        return "xs:h-32";
      })()} md:h-[500px]`}
    >
      <div
        className={`relative ${(() => {
          const tags = [
            car.isShielding && "Blindado",
            car.isZeroKm && "Zero KM",
            car.isConsignment && "Repasse",
            car.inPreparation && "Em Preparação",
            car.isSemiNovo && "Semi novo",
          ].filter(Boolean);
          if (tags.length >= 3) return "xs:h-36";
          if (tags.length === 1) return "xs:h-28";
          return "xs:h-32";
        })()} md:h-80 overflow-hidden bg-gray-100 xs:w-2/5 md:w-full`}
      >
        <OptimizedImage
          src={firstImageUrl}
          alt={car.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {isRecentlyAdded && (
          <div className="absolute top-2 right-2 xs:top-1 xs:right-1 z-20">
            <Badge
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-[10px] xs:text-[8px] px-2 xs:px-1.5 py-0.5 xs:py-0.5 shadow-lg animate-pulse"
              style={{
                fontFamily: "'Inter', 'Roboto', sans-serif",
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
              }}
            >
              NOVIDADE
            </Badge>
          </div>
        )}

        <div className="absolute top-2 xs:top-1 left-2 xs:left-1 flex flex-col gap-1"></div>
      </div>

      <CardContent className="p-2 xs:p-1 xs:w-3/5 xs:flex xs:flex-col xs:justify-between md:w-full md:p-4 relative">
        <div className="xs:flex xs:flex-col xs:h-full xs:justify-between">
          <div>
            <h3 className="font-bold text-sm xs:text-xs md:text-base text-black mb-1 xs:mb-0 group-hover:text-black transition-colors line-clamp-1">
              {car.title}
            </h3>
            <p className="text-xs text-gray-600 mb-2 xs:mb-1 md:mb-2 line-clamp-1">
              {car.description ?? ""}
            </p>
          </div>

          {(() => {
            const tags = [
              car.isShielding && "Blindado",
              car.isZeroKm && "Zero KM",
              car.isConsignment && "Repasse",
              car.inPreparation && "Em Preparação",
              car.isSemiNovo && "Semi novo",
            ].filter(Boolean);

            const hasOnlyOneTag = tags.length === 1;
            const hasThreeOrMoreTags = tags.length >= 3;

            return (
              <>
                {hasOnlyOneTag ? (
                  <div className="xs:flex xs:items-center xs:gap-2 md:block mb-2 xs:mb-1 md:mb-3">
                    <div className="text-sm xs:text-base md:text-sm font-bold text-red-600 md:mb-2">
                      {formatCurrency(car.price || "")}
                    </div>
                    <div className="flex flex-wrap gap-1 xs:gap-0.5 md:gap-2 min-h-4">
                      {car.isShielding && (
                        <Badge
                          className="bg-gray-100 text-black text-xs px-2 py-1 font-medium shadow-sm border-0 touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Blindado
                        </Badge>
                      )}
                      {car.isZeroKm && (
                        <Badge
                          className="bg-gray-100 text-black text-xs px-2 py-1 font-medium shadow-sm border-0 touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Zero KM
                        </Badge>
                      )}
                      {car.isConsignment && (
                        <Badge
                          className="bg-gray-100 text-black text-xs px-2 py-1 font-medium shadow-sm border-0 touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Repasse
                        </Badge>
                      )}
                      {car.inPreparation && (
                        <Badge
                          className="bg-gray-100 text-black text-xs px-2 py-1 font-medium shadow-sm border-0 touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Em Preparação
                        </Badge>
                      )}
                      {car.isSemiNovo && (
                        <Badge
                          className="bg-gray-100 text-black text-xs px-2 py-1 font-medium shadow-sm border-0 touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Semi novo
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-0.5 xs:gap-0.5 md:gap-1 mb-2 xs:mb-1 md:mb-3 min-h-4 max-w-full">
                      {car.isSemiNovo && (
                        <Badge
                          className="bg-gray-100 text-black text-xs px-2 py-1 font-medium shadow-sm border-0 touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Semi novo
                        </Badge>
                      )}

                      {car.isShielding && (
                        <Badge
                          className="bg-gray-100 text-black text-xs xs:text-xs xs:px-1 xs:py-0.5 px-1.5 py-0.5 md:px-1.5 md:py-0.5 font-medium shadow-sm border-0 whitespace-nowrap touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Blindado
                        </Badge>
                      )}
                      {car.isZeroKm && (
                        <Badge
                          className="bg-gray-100 text-black text-xs xs:text-xs xs:px-1 xs:py-0.5 px-1.5 py-0.5 md:px-1.5 md:py-0.5 font-medium shadow-sm border-0 whitespace-nowrap touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Zero KM
                        </Badge>
                      )}
                      {car.isConsignment && (
                        <Badge
                          className="bg-gray-100 text-black text-xs xs:text-xs xs:px-1 xs:py-0.5 px-1.5 py-0.5 md:px-1.5 md:py-0.5 font-medium shadow-sm border-0 whitespace-nowrap touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Repasse
                        </Badge>
                      )}
                      {car.inPreparation && (
                        <Badge
                          className="bg-gray-100 text-black text-xs xs:text-xs xs:px-1 xs:py-0.5 px-1.5 py-0.5 md:px-1.5 md:py-0.5 font-medium shadow-sm border-0 whitespace-nowrap touch-manipulation select-none pointer-events-none"
                          style={{
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                          }}
                        >
                          Em preparação
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm xs:text-base md:text-sm font-bold text-red-600 mb-1 xs:mb-0.5">
                      {formatCurrency(car.price || "")}
                    </div>
                  </>
                )}
              </>
            );
          })()}

          <div className="flex gap-2 mt-auto">
            <Button
              className="text-xs xs:text-xs md:text-base h-6 xs:h-5 md:h-9 px-2 xs:px-1 md:px-6 py-0.5 md:py-2 flex-1"
              size="sm"
              onClick={() => {
                const externalLink = generateCarLink(car.title, car.id);
                window.location.href = externalLink;
              }}
            >
              <Eye className="h-3 w-3 xs:h-2.5 xs:w-2.5 md:h-4 md:w-4 mr-1 xs:mr-0.5" />
              <span className="xs:text-xs md:text-base">Detalhes</span>
            </Button>

            {favoritesManager && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs xs:text-xs md:text-base h-6 xs:h-5 md:h-9 px-2 xs:px-2 md:px-3 py-0.5 md:py-2 flex-shrink-0"
                onClick={handleToggleFavorite}
                aria-label={
                  isFavorite
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
              >
                <Heart
                  className={`h-3 w-3 xs:h-5 xs:w-5 md:h-4 md:w-4 transition-colors ${isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 hover:text-red-500"
                    }`}
                />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default CarCard;
