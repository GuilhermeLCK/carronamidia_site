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
    isShielding: false,
    isSemiNovo: false,
    isZeroKm: false,
    isConsignment: false,
    showAll: true,
  });

  const handleFilterChange = (newFilters: CarFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <HeroSection />
      <CarFilters onFilterChange={handleFilterChange} />
      <CarGrid filters={filters} />
    </div>
  );
};

export default Index;
