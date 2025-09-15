import { useState, useEffect, useMemo } from "react";
import { getAllCars } from "@/services/firebase";
import { Car } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";

interface UseCarsReturn {
  cars: Car[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCars = (): UseCarsReturn => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      const firebaseCars = await getAllCars();
      setCars(firebaseCars);
    } catch (err) {
      console.error("Failed to fetch cars from Firebase:", err);
      setError("Erro ao carregar carros");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return {
    cars,
    loading,
    error,
    refetch: fetchCars,
  };
};
