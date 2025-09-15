import { useMemo, useRef, useEffect, useState } from "react";
import CarCard, { Car } from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import { CarFilters } from "./CarFilters";
import { getAllCars } from "@/services/firebase";
import { Car as CarIcon, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CarGridProps {
  filters: CarFilters;
}

const CarGrid = ({ filters }: CarGridProps) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const allCars = await getAllCars();
      setCars(allCars);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
      setError("Erro ao carregar carros");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars.filter((car) => car.active);

    if (filters.year) {
      filtered = filtered.filter(
        (car) => car.year?.toString() === filters.year
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter((car) => {
        const price = parseFloat(car.price || "0");
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.model.toLowerCase().includes(searchTerm) ||
          car.brand.toLowerCase().includes(searchTerm) ||
          car.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.fuelType) {
      filtered = filtered.filter((car) =>
        car.description?.toLowerCase().includes(filters.fuelType.toLowerCase())
      );
    }
    if (filters.transmission) {
      filtered = filtered.filter((car) =>
        car.description
          ?.toLowerCase()
          .includes(filters.transmission.toLowerCase())
      );
    }

    if (filters.isShielding !== undefined) {
      filtered = filtered.filter(
        (car) => car.isShielding === filters.isShielding
      );
    }

    if (!filters.showAll) {
      filtered = filtered.filter((car) => {
        if (filters.isZeroKm && car.isZeroKm) return true;
        if (filters.isConsignment && car.isConsignment) return true;
        return false;
      });
    }
    return filtered.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.toDate() - a.createdAt.toDate();
      }
      return 0;
    });
  }, [cars, filters]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <CarIcon className="h-6 w-6 xs:h-5 xs:w-5 text-primary" />
          <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>

        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-64 animate-pulse mb-4"></div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CarCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error && cars.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Erro ao carregar veículos
          </h3>
          <p className="text-muted-foreground mb-6">
            Não foi possível conectar ao banco de dados
          </p>
          <Button onClick={fetchCars} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {error && cars.length > 0 && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Conectado ao modo offline. Exibindo dados locais.
            <Button
              variant="link"
              size="sm"
              onClick={fetchCars}
              className="p-0 h-auto text-orange-600 underline ml-1"
            >
              Tentar reconectar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CarIcon className="h-6 w-6 xs:h-5 xs:w-5 text-primary" />
          <h2 className="text-2xl xs:text-lg md:text-2xl font-semibold">
            {filteredAndSortedCars.length}{" "}
            {filteredAndSortedCars.length === 1
              ? "Veículo Encontrado"
              : "Veículos Encontrados"}
          </h2>
        </div>
      </div>
      {filteredAndSortedCars.length > 0 && (
        <div>
          <h2 className="text-2xl xs:text-lg md:text-2xl font-bold text-gray-900 mb-6 xs:mb-4">
            Confira nossos carros
          </h2>
          <VirtualizedCarGrid cars={filteredAndSortedCars} />
        </div>
      )}
      {filteredAndSortedCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum carro encontrado com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
};

interface VirtualizedCarGridProps {
  cars: Car[];
}

const VirtualizedCarGrid = ({ cars }: VirtualizedCarGridProps) => {
  const [visibleCars, setVisibleCars] = useState<Car[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12; // Reduced for better performance
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  // Initial load
  useEffect(() => {
    const initialItems = cars.slice(0, itemsPerPage);
    setVisibleCars(initialItems);
    setPage(1);
  }, [cars]);

  // Auto-load more cars when scrolling near bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && page < totalPages && !isLoadingMore) {
          loadMoreCars();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, isLoadingMore]);

  const loadMoreCars = async () => {
    if (page >= totalPages || isLoadingMore) return;

    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const nextPage = page + 1;
    const endIndex = nextPage * itemsPerPage;
    const newItems = cars.slice(0, endIndex);

    setVisibleCars(newItems);
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  return (
    <div>
      <div
        className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        ref={containerRef}
      >
        {visibleCars.map((car, index) => (
          <CarCard key={`${car.id}-${index}`} car={car} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {Array.from({ length: 3 }).map((_, index) => (
              <CarCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        </div>
      )}

      {/* Load more trigger (invisible) */}
      {page < totalPages && (
        <div
          ref={loadMoreRef}
          className="h-10 flex justify-center items-center mt-8"
        >
          {!isLoadingMore && (
            <Button
              onClick={loadMoreCars}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Carregar mais veículos ({cars.length - visibleCars.length}{" "}
              restantes)
            </Button>
          )}
        </div>
      )}

      {/* End of results */}
      {page >= totalPages && visibleCars.length > 0 && (
        <div className="text-center mt-8 py-4">
          <p className="text-gray-500 text-sm">
            ✨ Você viu todos os {cars.length} veículos disponíveis
          </p>
        </div>
      )}
    </div>
  );
};

export default CarGrid;
