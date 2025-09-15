import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Settings, Star, Truck, Shield, Eye } from "lucide-react";
import { memo } from "react";
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
  createdAt: any;
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
}

const CarCard = memo(function CarCard({ car }: CarCardProps) {
  const formatCurrency = (value: string | number): string => {
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
  };

  const isRecentlyAdded = (): boolean => {
    try {
      if (!car.createdAt) return false;

      const createdDate = car.createdAt.toDate
        ? car.createdAt.toDate()
        : new Date(car.createdAt);

      const now = new Date();
      const timeDifference = now.getTime() - createdDate.getTime();
      const hoursDifference = timeDifference / (1000 * 3600);

      return hoursDifference <= 24;
    } catch {
      return false;
    }
  };

  const getFirstImageUrl = () => {
    if (!car.images || car.images.length === 0) return "/placeholder.svg";
    const firstImage = car.images[0];
    if (typeof firstImage === "string") return firstImage;
    return firstImage.url || firstImage.base64 || "/placeholder.svg";
  };

  // Removed preloadImage as OptimizedImage now handles lazy loading

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col xs:flex-row md:flex-col xs:h-28 md:h-[500px]">
      <div className="relative xs:h-28 md:h-80 overflow-hidden bg-gray-100 xs:w-2/5 md:w-full">
        <OptimizedImage
          src={getFirstImageUrl()}
          alt={car.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {isRecentlyAdded() && (
          <div className="absolute top-1 right-1 xs:top-1 xs:right-1 z-10">
            <Badge
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg border-0 font-semibold text-xs px-1 py-0.5 animate-pulse"
              style={{ animationDuration: "2s" }}
            >
              ✨ Novo
            </Badge>
          </div>
        )}

        <div className="absolute top-2 xs:top-1 left-2 xs:left-1 flex flex-col gap-1"></div>
      </div>

      <CardContent className="p-2 xs:p-1 xs:w-3/5 xs:flex xs:flex-col xs:justify-between md:w-full md:p-4 relative">
        <div className="xs:flex xs:flex-col xs:h-full xs:justify-between">
          <div>
            <h3 className="font-medium text-sm xs:text-xs md:text-base text-gray-900 mb-1 xs:mb-0 group-hover:text-primary transition-colors line-clamp-1">
              {car.title}
            </h3>
            <p className="text-xs text-gray-600 mb-2 xs:mb-1 md:mb-2 line-clamp-1">
              {car.description ?? ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 xs:gap-0.5 md:gap-2 mb-2 xs:mb-1 md:mb-3 min-h-4">
            {car.isShielding && (
              <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-1 py-0.5 font-medium shadow-sm border-0 hover:shadow-md transition-shadow">
                🛡️ Blindado
              </Badge>
            )}
            {car.isZeroKm && (
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-1 py-0.5 font-medium shadow-sm border-0 hover:shadow-md transition-shadow">
                ✨ Zero
              </Badge>
            )}
            {car.isConsignment && (
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-1 py-0.5 font-medium shadow-sm border-0 hover:shadow-md transition-shadow">
                🔄 Repasse
              </Badge>
            )}
          </div>

          <div className="text-lg xs:text-xs md:text-xl font-bold text-primary mb-1 xs:mb-0.5">
            {formatCurrency(car.price || "")}
          </div>

          <Button
            className="text-xs xs:text-xs md:text-base h-6 xs:h-5 md:h-9 px-2 xs:px-1 md:px-6 py-0.5 md:py-2 w-full xs:w-full md:w-auto mt-auto"
            size="sm"
            onClick={() => {
              const externalLink = generateCarLink(car.title, car.id);
              window.open(externalLink, "_blank");
            }}
          >
            <Eye className="h-3 w-3 xs:h-2.5 xs:w-2.5 md:h-4 md:w-4 mr-1 xs:mr-0.5" />
            <span className="xs:text-xs md:text-base">Detalhes</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default CarCard;
