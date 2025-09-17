import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Heart,
  X,
  Car,
} from "lucide-react";

interface FilterProps {
  onFilterChange: (filters: CarFilters) => void;
  onFavoritesChange?: {
    toggleLocalFavorite: (carId: string) => void;
    isLocalFavorite: (carId: string) => boolean;
    getLocalFavoritesCars: (cars: any[]) => any[];
    localFavorites: Set<string>;
  };
  totalCars?: number;
}

export interface CarFilters {
  model: string;
  priceMin: string;
  priceMax: string;
  priceRange: [number, number];
  year: string;
  searchTerm: string;
  fuelType: string;
  transmission: string;
  category: string;
  isShielding: boolean | undefined;
  isZeroKm: boolean;
  isConsignment: boolean;
  isSemiNew: boolean;
  showAll: boolean;
  showFavorites: boolean;
}

const CarFilters = ({
  onFilterChange,
  onFavoritesChange,
  totalCars = 0,
}: FilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const localFavorites = onFavoritesChange?.localFavorites || new Set<string>();
  const [filters, setFilters] = useState<CarFilters>({
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
    isZeroKm: false,
    isConsignment: false,
    isSemiNew: false,
    showAll: true,
    showFavorites: false,
  });



  const handleFilterChange = (
    key: keyof CarFilters,
    value: string | boolean | [number, number]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagFilter = (
    tag: "isZeroKm" | "isConsignment" | "isSemiNew" | "showAll"
  ) => {
    let newFilters = { ...filters };

    if (tag === "showAll") {
      newFilters = {
        ...filters,
        isZeroKm: false,
        isConsignment: false,
        isSemiNew: false,
        showAll: true,
        showFavorites: false,
      };
    } else {
      newFilters = {
        ...filters,
        isZeroKm: tag === "isZeroKm",
        isConsignment: tag === "isConsignment",
        isSemiNew: tag === "isSemiNew",
        showAll: false,
        showFavorites: false,
      };
    }

    setFilters(newFilters);
    onFilterChange(newFilters);

    // Scroll para o topo da listagem
    scrollToTop();
  };

  const handleFavoritesFilter = () => {
    const newFilters = {
      ...filters,
      showFavorites: true,
      showAll: false,
      isZeroKm: false,
      isConsignment: false,
      isSemiNew: false,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);

    // Scroll para o topo da listagem
    scrollToTop();
  };

  const clearFilters = () => {
    const emptyFilters: CarFilters = {
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
      isZeroKm: false,
      isConsignment: false,
      isSemiNew: false,
      showAll: true,
      showFavorites: false,
    };



    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.year !== "" ||
      filters.fuelType !== "" ||
      filters.transmission !== "" ||
      filters.category !== "" ||
      filters.isShielding === true ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000000 ||
      filters.searchTerm !== "" ||
      filters.priceMin !== "" ||
      filters.priceMax !== "" ||
      !filters.showAll
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isExpanded) return;

      const target = e.target as HTMLElement;
      if (
        target.closest(
          'button, select, input, label, [role="combobox"], [role="option"], [data-radix-collection-item], [data-state], [data-radix-select-trigger], [data-radix-select-content], [data-radix-select-item], [data-radix-select-viewport], .radix-select, .select-trigger, .select-content'
        )
      ) {
        return;
      }

      setStartY(e.touches[0].clientY);
      setIsDragging(true);
    },
    [isExpanded]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !isExpanded) return;
      const currentY = e.touches[0].clientY;
      setCurrentY(currentY);

      const deltaY = startY - currentY;
      if (deltaY > 0) {
        const progress = Math.min(deltaY / 100, 1);
        if (expandedContentRef.current) {
          expandedContentRef.current.style.transform = `translateY(-${progress * 20
            }px)`;
          expandedContentRef.current.style.opacity = `${1 - progress * 0.3}`;
        }
      }
    },
    [isDragging, isExpanded, startY]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !isExpanded) return;

    const deltaY = startY - currentY;
    if (deltaY > 50) {
      setIsExpanded(false);
    }

    if (expandedContentRef.current) {
      expandedContentRef.current.style.transform = "";
      expandedContentRef.current.style.opacity = "";
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  }, [isDragging, isExpanded, startY, currentY]);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isExpanded) return;

      const target = event.target as HTMLElement;
      if (
        target.closest(
          'button, select, input, label, [role="combobox"], [role="option"], [data-radix-collection-item], [data-state], [data-radix-select-trigger], [data-radix-select-content], [data-radix-select-item], [data-radix-select-viewport], .radix-select, .select-trigger, .select-content, [data-radix-slider-root], [data-radix-slider-track], [data-radix-slider-range], [data-radix-slider-thumb], [data-radix-checkbox-root], [data-radix-checkbox-indicator]'
        )
      ) {
        return;
      }
      if (filtersRef.current && !filtersRef.current.contains(target)) {
        const hasFilters = hasActiveFilters();
        setIsExpanded(false);
        if (hasFilters) {
          scrollToTop();
        }
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded]);





  const years = Array.from({ length: 15 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  return (
    <div
      id="filters"
      ref={filtersRef}
      className="sticky top-0 z-50 py-5 px-4 bg-background border-b border-border/50 xs:py-2"
    >
      <div className="max-w-7xl mx-auto relative" id="filters-container">
        <div className="text-center mb-4">
          <h1 className="text-2xl xs:text-lg md:text-3xl font-black text-foreground tracking-wide">
            CONFIRA NOSSO ESTOQUE
          </h1>
        </div>
        <div className="mb-2 md:mb-4">
          <div className="flex items-center gap-3 xs:gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 xs:left-2 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 xs:h-3 xs:w-3 md:h-6 md:w-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por modelo, marca..."
                value={filters.searchTerm}
                onChange={(e) => {
                  handleFilterChange("searchTerm", e.target.value);
                  if (e.target.value.trim() !== '') {
                    scrollToTop();
                  }
                }}
                className="pl-10 xs:pl-8 md:pl-12 pr-4 h-12 xs:h-8 md:h-14 text-base xs:text-xs md:text-lg bg-input/50 border-border/50 focus:border-primary/50 rounded-xl transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs xs:text-xs md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors underline decoration-1 underline-offset-2"
              >
                <SlidersHorizontal className="h-3 w-3 xs:h-3 xs:w-3 md:h-6 md:w-6 text-red-600" />
                <span>Filtros Avançados</span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3 xs:h-3 xs:w-3 md:h-6 md:w-6" />
                ) : (
                  <ChevronDown className="h-3 w-3 xs:h-3 xs:w-3 md:h-6 md:w-6" />
                )}
              </button>
            </div>

            {!isExpanded && hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs xs:text-[10px] md:text-sm px-3 h-12 xs:h-8 md:h-14 border-destructive/50 text-destructive hover:bg-destructive/10 rounded-xl"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        <div className="mb-0 md:mb-2">
          <div className="max-w-5xl mx-auto">
            <div className="max-h-96 opacity-100">
              <div className="hidden md:flex flex-row gap-3 md:gap-4 mb-2">
                <Button
                  variant={filters.showAll ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagFilter("showAll")}
                  className="flex-1 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Estoque Completo
                </Button>

                <Button
                  variant={filters.isZeroKm ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagFilter("isZeroKm")}
                  className="flex-1 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Zero KM
                </Button>

                <Button
                  variant={filters.isSemiNew ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagFilter("isSemiNew")}
                  className="flex-1 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Semi Novo
                </Button>

                <Button
                  variant={filters.isConsignment ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagFilter("isConsignment")}
                  className="flex-1 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Repasse
                </Button>

                <Button
                  variant={filters.showFavorites ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFavoritesFilter()}
                  className="flex-1 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Favoritos ({localFavorites.size})
                </Button>
              </div>

              <div className="md:hidden mb-2">
                <div className="space-y-2">
                  <div className="w-full">
                    <Button
                      variant={filters.showAll ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("showAll")}
                      className="w-full h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Estoque Completo
                    </Button>
                  </div>

                  {/* Os outros 4 botões na segunda linha */}
                  <div className="grid grid-cols-4 gap-1">
                    <Button
                      variant={filters.isZeroKm ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("isZeroKm")}
                      className="h-8 px-1 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Zero KM
                    </Button>

                    <Button
                      variant={filters.isSemiNew ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("isSemiNew")}
                      className="h-8 px-1 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Semi Novo
                    </Button>

                    <Button
                      variant={filters.isConsignment ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("isConsignment")}
                      className="h-8 px-1 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Repasse
                    </Button>

                    <Button
                      variant={filters.showFavorites ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFavoritesFilter()}
                      className="h-8 px-1 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Favoritos ({localFavorites.size})
                    </Button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={expandedContentRef}
            className="transform transition-all duration-300 ease-out"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 xs:gap-2 md:gap-3 mb-6">
              <Select
                value={filters.year}
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-sm">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem
                      key={year}
                      value={year}
                      className="text-base xs:text-xs md:text-sm"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.fuelType}
                onValueChange={(value) => handleFilterChange("fuelType", value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-sm">
                  <SelectValue placeholder="Combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Diesel"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Diesel
                  </SelectItem>
                  <SelectItem
                    value="Flex"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Flex
                  </SelectItem>
                  <SelectItem
                    value="Gasolina"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Gasolina
                  </SelectItem>
                  <SelectItem
                    value="Híbrido"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Híbrido
                  </SelectItem>
                  <SelectItem
                    value="Híbrido Plug-in"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Híbrido Plug-in
                  </SelectItem>
                  <SelectItem
                    value="Elétrico"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Elétrico
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.transmission}
                onValueChange={(value) =>
                  handleFilterChange("transmission", value)
                }
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-sm">
                  <SelectValue placeholder="Câmbio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Aut"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Automático
                  </SelectItem>
                  <SelectItem
                    value="Mec"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Manual
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-sm">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="SUV de Grande Porte"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    SUV de Grande Porte
                  </SelectItem>
                  <SelectItem
                    value="SUV de Médio Porte"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    SUV de Médio Porte
                  </SelectItem>
                  <SelectItem
                    value="SUV Compacto"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    SUV Compacto
                  </SelectItem>
                  <SelectItem
                    value="Picape Media"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Picape Media
                  </SelectItem>
                  <SelectItem
                    value="Picape Intermediaria"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Picape Intermediaria
                  </SelectItem>
                  <SelectItem
                    value="Utilitarios"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Utilitarios
                  </SelectItem>
                  <SelectItem
                    value="Sedan Popular"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Sedan Popular
                  </SelectItem>
                  <SelectItem
                    value="Sedan Medio"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Sedan Medio
                  </SelectItem>
                  <SelectItem
                    value="Hatch Popular"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Hatch Popular
                  </SelectItem>
                  <SelectItem
                    value="Hatch Premium"
                    className="text-base xs:text-xs md:text-sm"
                  >
                    Hatch Premium
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between p-3 bg-input/50 border border-border/50 rounded-lg h-11 xs:h-8 md:h-12">
                <label
                  htmlFor="blindagem"
                  className="text-base xs:text-xs md:text-sm"
                >
                  Apenas Blindados
                </label>
                <Checkbox
                  id="blindagem"
                  checked={filters.isShielding === true}
                  onCheckedChange={(checked) => {
                    handleFilterChange(
                      "isShielding",
                      checked ? true : undefined
                    );
                  }}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />

              </div>
            </div>

            <div className="mt-6 xs:mt-3 md:mt-8">
              <label className="text-sm xs:text-xs md:text-base font-medium text-muted-foreground mb-3 xs:mb-2 md:mb-4 block text-center xs:text-center md:text-left">
                Faixa de Preço
              </label>
              <div className="grid grid-cols-2 gap-3 xs:gap-2 md:gap-4">
                <div className="relative">
                  <span className="absolute left-3 xs:left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base xs:text-xs md:text-sm">
                    R$
                  </span>
                  <Input
                    type="text"
                    placeholder="Valor mínimo"
                    value={filters.priceMin}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      const formattedValue = rawValue ? parseInt(rawValue).toLocaleString('pt-BR') : '';
                      const numericValue = rawValue ? parseInt(rawValue) : 0;

                      const newFilters = {
                        ...filters,
                        priceMin: formattedValue,
                        priceRange: [numericValue, filters.priceRange[1]] as [number, number]
                      };

                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                    className="pl-10 xs:pl-8 md:pl-12 pr-4 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-sm bg-input/50 border-border/50 focus:border-primary/50 rounded-lg transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 xs:left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base xs:text-xs md:text-sm">
                    R$
                  </span>
                  <Input
                    type="text"
                    placeholder="Valor máximo"
                    value={filters.priceMax}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      const formattedValue = rawValue ? parseInt(rawValue).toLocaleString('pt-BR') : '';
                      const numericValue = rawValue ? parseInt(rawValue) : 1000000;

                      const newFilters = {
                        ...filters,
                        priceMax: formattedValue,
                        priceRange: [filters.priceRange[0], numericValue] as [number, number]
                      };

                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                    className="pl-10 xs:pl-8 md:pl-12 pr-4 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-sm bg-input/50 border-border/50 focus:border-primary/50 rounded-lg transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex justify-center mt-6 xs:mt-3 md:mt-8">
              <button
                onClick={() => {
                  const hasFilters = hasActiveFilters();
                  setIsExpanded(false);
                  if (hasFilters) {
                    scrollToTop();
                  }
                }}
                className="group flex flex-col items-center gap-0.5 xs:gap-0.5 md:gap-1 py-1 xs:py-0.5 px-2 xs:px-1.5 md:py-2 md:px-4 rounded-t-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 border-t border-l border-r border-border/30"
              >
                <div className="w-5 xs:w-4 md:w-8 h-0.5 xs:h-0.5 md:h-1 bg-muted-foreground/40 rounded-full group-hover:bg-muted-foreground/60 transition-colors"></div>
                <ChevronUp className="h-2.5 w-2.5 xs:h-2 xs:w-2 md:h-4 md:w-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                <span className="text-[10px] xs:text-[9px] md:text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                  Fechar
                </span>
              </button>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 border-border/50 hover:bg-destructive/10 hover:border-destructive/50 transition-all h-10 xs:h-7 md:h-12 px-6 xs:px-2 md:px-8 text-base xs:text-xs md:text-lg"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-1 xs:mt-0 text-center border-t border-border/30 pt-1 xs:pt-0 md:pt-4">
          <div className="flex items-center justify-center gap-2 mt-2 xs:mt-1 xs:justify-start md:justify-center">
            <Car className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <p className="text-sm xs:text-xs md:text-base font-medium text-muted-foreground">
              {totalCars}{" "}
              {totalCars === 1 ? "Veículo Encontrado" : "Veículos Encontrados"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;
