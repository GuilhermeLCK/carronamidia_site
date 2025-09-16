import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CarFilters, {
  CarFilters as CarFiltersType,
} from "@/components/CarFilters";
import CarGrid from "@/components/CarGrid";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
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

  const [localFavorites, setLocalFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('carFavorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [totalCars, setTotalCars] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('carFavorites', JSON.stringify(Array.from(localFavorites)));
  }, [localFavorites]);

  const toggleLocalFavorite = (carId: string) => {
    setLocalFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
        toast({
          title: "Veículo removido!",
          description: "Veículo foi retirado dos seus favoritos.",
          className: "bg-gray-100 text-black border-gray-200",
        });
      } else {
        newFavorites.add(carId);
        toast({
          title: "Veículo favoritado!",
          description: "O veículo foi adicionado aos seus favoritos.",
          className: "bg-gray-100 text-black border-gray-200",
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

  const handleTotalCarsChange = (total: number) => {
    setTotalCars(total);
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
        totalCars={totalCars}
      />
      <CarGrid
        filters={filters}
        favoritesManager={{
          toggleLocalFavorite,
          isLocalFavorite,
          getLocalFavoritesCars,
          localFavorites,
        }}
        onTotalCarsChange={handleTotalCarsChange}
      />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
