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
  favoritesManager?: {
    toggleLocalFavorite: (carId: string) => void;
    isLocalFavorite: (carId: string) => boolean;
    getLocalFavoritesCars: (cars: any[]) => any[];
    localFavorites: Set<string>;
  };
  onTotalCarsChange?: (total: number) => void;
}

const CarGrid = ({
  filters,
  favoritesManager,
  onTotalCarsChange,
}: CarGridProps) => {
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
    if (!cars || cars.length === 0) return [];
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
      const searchTerms = filters.searchTerm
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 0);
      filtered = filtered.filter((car) => {
        const carText = `${car.model || ""} ${car.brand || ""} ${
          car.description || ""
        } ${car.title || ""}`.toLowerCase();
        return searchTerms.every((term) => carText.includes(term));
      });
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

    if (filters.category) {
      filtered = filtered.filter((car) =>
        car.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.isShielding !== undefined) {
      filtered = filtered.filter(
        (car) => car.isShielding === filters.isShielding
      );
    }

    if (filters.showFavorites && favoritesManager) {
      filtered = favoritesManager.getLocalFavoritesCars(filtered);
    } else if (!filters.showAll) {
      filtered = filtered.filter((car) => {
        if (filters.isZeroKm && car.isZeroKm) return true;
        if (filters.isConsignment && car.isConsignment) return true;
        if (filters.isSemiNew && car.isSemiNovo) return true;
        return false;
      });
    }
    const sorted = filtered.sort((a, b) => {
      const isRecentlyAdded = (car: any): boolean => {
        try {
          if (!car.createdAt) return false;
          const createdDate = car.createdAt.toDate
            ? car.createdAt.toDate()
            : new Date(car.createdAt);
          const now = new Date();
          const timeDifference = Math.abs(
            now.getTime() - createdDate.getTime()
          );
          const hoursDifference = timeDifference / (1000 * 3600);
          return hoursDifference <= 24;
        } catch {
          return false;
        }
      };

      const aIsNew = isRecentlyAdded(a);
      const bIsNew = isRecentlyAdded(b);
      const aHasUpdated = !!a.updatedAt;
      const bHasUpdated = !!b.updatedAt;

      if (aHasUpdated && !bHasUpdated) {
        return -1;
      }
      if (!aHasUpdated && bHasUpdated) {
        return 1;
      }

      if (aHasUpdated && bHasUpdated) {
        try {
          const aUpdatedDate = a.updatedAt.toDate
            ? a.updatedAt.toDate()
            : new Date(a.updatedAt);
          const bUpdatedDate = b.updatedAt.toDate
            ? b.updatedAt.toDate()
            : new Date(b.updatedAt);

          return bUpdatedDate.getTime() - aUpdatedDate.getTime();
        } catch {
          return 0;
        }
      }

      if (aIsNew && !bIsNew) {
        return -1;
      }
      if (!aIsNew && bIsNew) {
        return 1;
      }
      if (aIsNew && bIsNew && a.createdAt && b.createdAt) {
        const aDate = a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
        const bDate = b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      }

      if (a.createdAt && b.createdAt) {
        const aDate = a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
        const bDate = b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      }

      return 0;
    });

    return sorted;
  }, [cars, filters]);

  useEffect(() => {
    if (onTotalCarsChange) {
      onTotalCarsChange(filteredAndSortedCars.length);
    }
  }, [filteredAndSortedCars.length, onTotalCarsChange]);

  if (loading) {
    return (
      <div className="w-[90%] xs:w-[99%] mx-auto px-4 xs:px-2 py-px xs:py-px md:py-3 ">
        <div className="flex items-center gap-3 mb-8">
          <CarIcon className="h-6 w-6 xs:h-5 xs:w-5 text-primary" />
          <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>

        <div className="mb-6">
          <div className="h-8 bg-gray-300 rounded w-64 animate-pulse mb-4"></div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 xs:gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error && cars.length === 0) {
    return (
      <div className="w-[90%] xs:w-[99%] mx-auto px-4 xs:px-2 py-0 xs:py-0 md:py-12">
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
    <div className="w-[90%] xs:w-[99%] mx-auto px-4 xs:px-2 py-0 xs:py-0 md:py-12">
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

      {filteredAndSortedCars.length > 0 && (
        <div>
          <VirtualizedCarGrid
            cars={filteredAndSortedCars}
            favoritesManager={favoritesManager}
          />
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
  favoritesManager?: {
    toggleLocalFavorite: (carId: string) => void;
    isLocalFavorite: (carId: string) => boolean;
    getLocalFavoritesCars: (cars: any[]) => any[];
    localFavorites: Set<string>;
  };
}

const VirtualizedCarGrid = ({
  cars,
  favoritesManager,
}: VirtualizedCarGridProps) => {
  const [visibleCars, setVisibleCars] = useState<Car[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  useEffect(() => {
    const initialItems = cars.slice(0, itemsPerPage);
    setVisibleCars(initialItems);
    setPage(1);
  }, [cars]);

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
        className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 xs:gap-2 xs:px-1 "
        ref={containerRef}
      >
        {visibleCars.map((car, index) => (
          <CarCard
            key={`${car.id}-${index}`}
            car={car}
            favoritesManager={favoritesManager}
          />
        ))}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 xs:gap-2 xs:px-1 w-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        </div>
      )}

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

      {page >= totalPages && visibleCars.length > 0 && (
        <div className="text-center mt-8 py-4">
          <p className="text-gray-500 text-sm">
            Você viu todos os {cars.length} veículos disponíveis
          </p>
        </div>
      )}
    </div>
  );
};

export default CarGrid;
