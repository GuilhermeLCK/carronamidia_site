import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CarFilters, {
  CarFilters as CarFiltersType,
} from "@/components/CarFilters";
import CarGrid from "@/components/CarGrid";

const Index = () => {
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
  
  // Estado para gerenciar favoritos localmente
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());
  
  // Funções para gerenciar favoritos localmente
  const toggleLocalFavorite = (carId: string) => {
    setLocalFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      return newFavorites;
    });
  };
  
  const isLocalFavorite = (carId: string) => {
    return localFavorites.has(carId);
  };
  
  const getLocalFavoritesCars = (cars: any[]) => {
    return cars.filter(car => localFavorites.has(car.id));
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
