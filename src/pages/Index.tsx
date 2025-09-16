import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CarFilters, {
  CarFilters as CarFiltersType,
} from "@/components/CarFilters";
import CarGrid from "@/components/CarGrid";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<CarFiltersType>({
    model: "",
    priceMin: "",
    priceMax: "",
    priceRange: [0, 1000000],
    year: "",
    searchTerm: "",
    fuelType: "",
    transmission: "",
    category: "",
    isShielding: undefined,
    isSemiNew: false,
    isZeroKm: false,
    isConsignment: false,
    showAll: true,
    showFavorites: false,
  });

  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());

  const toggleLocalFavorite = (carId: string) => {
    setLocalFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
        toast({
          title: "Veículo favoritado!",
          description: "O veículo foi adicionado aos seus favoritos.",
        });
      }
      return newFavorites;
    });
  };

  const isLocalFavorite = (carId: string) => {
    return localFavorites.has(carId);
  };

  const getLocalFavoritesCars = (cars: any[]) => {
    return cars.filter((car) => localFavorites.has(car.id));
  };

  const handleFilterChange = (newFilters: CarFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <HeroSection />
      <CarFilters
        onFilterChange={handleFilterChange}
        onFavoritesChange={{
          toggleLocalFavorite,
          isLocalFavorite,
          getLocalFavoritesCars,
          localFavorites,
        }}
      />
      <CarGrid
        filters={filters}
        favoritesManager={{
          toggleLocalFavorite,
          isLocalFavorite,
          getLocalFavoritesCars,
          localFavorites,
        }}
      />
    </div>
  );
};

export default Index;
