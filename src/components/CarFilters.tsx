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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Heart,
  X,
} from "lucide-react";

interface FilterProps {
  onFilterChange: (filters: CarFilters) => void;
  onFavoritesChange?: {
    toggleLocalFavorite: (carId: string) => void;
    isLocalFavorite: (carId: string) => boolean;
    getLocalFavoritesCars: (cars: any[]) => any[];
    localFavorites: Set<string>;
  };
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

const CarFilters = ({ onFilterChange, onFavoritesChange }: FilterProps) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [isStockOptionsExpanded, setIsStockOptionsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
      filters.searchTerm !== ""
    );
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isExpanded) return;

    const target = e.target as HTMLElement;
    if (target.closest('button, select, input, label, [role="combobox"], [role="option"], [data-radix-collection-item], [data-state], [data-radix-select-trigger], [data-radix-select-content], [data-radix-select-item], [data-radix-select-viewport], .radix-select, .select-trigger, .select-content')) {
      return;
    }

    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  }, [isExpanded]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !isExpanded) return;
    const currentY = e.touches[0].clientY;
    setCurrentY(currentY);

    const deltaY = startY - currentY;
    if (deltaY > 0) {
      const progress = Math.min(deltaY / 100, 1);
      if (expandedContentRef.current) {
        expandedContentRef.current.style.transform = `translateY(-${progress * 20}px)`;
        expandedContentRef.current.style.opacity = `${1 - progress * 0.3}`;
      }
    }
  }, [isDragging, isExpanded, startY]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !isExpanded) return;

    const deltaY = startY - currentY;
    if (deltaY > 50) {
      setIsExpanded(false);
    }

    if (expandedContentRef.current) {
      expandedContentRef.current.style.transform = '';
      expandedContentRef.current.style.opacity = '';
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  }, [isDragging, isExpanded, startY, currentY]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const years = Array.from({ length: 15 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  return (
    <div
      id="filters"
      ref={filtersRef}
      className="sticky top-0 z-50 py-4 px-4 bg-background border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 xs:gap-1">
            <SlidersHorizontal className="h-5 w-5 xs:h-3 xs:w-3 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl xs:text-base md:text-2xl font-semibold">
              Filtrar Veículos
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isExpanded && hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs xs:text-[10px] md:text-sm px-2 xs:px-1 md:px-3 h-8 xs:h-6 md:h-9 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Limpar Filtros
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1 h-8 xs:h-6 md:h-9 hover:bg-muted/50 transition-all duration-200 rounded-lg"
            >
              <span className="text-xs xs:text-[10px] md:text-sm">Filtros Avançados</span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3 xs:h-2 xs:w-2 md:h-4 md:w-4" />
              ) : (
                <ChevronDown className="h-3 w-3 xs:h-2 xs:w-2 md:h-4 md:w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mb-3 max-w-lg xs:max-w-md md:max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 xs:left-2 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 xs:h-3 xs:w-3 md:h-6 md:w-6 text-muted-foreground" />
            <Input
              placeholder="Buscar por modelo do veículo..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="pl-10 xs:pl-7 md:pl-12 h-12 xs:h-8 md:h-14 text-base xs:text-xs md:text-lg bg-input/50 border-border/50 focus:border-primary/50 focus:bg-input transition-all rounded-xl shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        <div className="mb-1">
          <div className="max-w-5xl mx-auto">
            <div className={`transition-all duration-300 ease-in-out ${isScrolled ? 'md:max-h-96 md:opacity-100 max-h-0 opacity-0 overflow-hidden' : 'max-h-96 opacity-100'
              }`}>
              <div className="hidden md:flex flex-col md:flex-row gap-3 xs:gap-2 md:gap-4 mb-2">
                <div className="flex xs:flex-row gap-3 xs:gap-2 md:contents">
                  <Button
                    variant={filters.showAll ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagFilter("showAll")}
                    className="flex-1 xs:flex-1 md:flex-1 h-12 xs:h-10 md:h-14 px-6 xs:px-4 md:px-8 text-base xs:text-sm md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Estoque Completo
                  </Button>

                  <Button
                    variant={filters.showFavorites ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFavoritesFilter()}
                    className="flex-1 xs:flex-1 md:flex-1 h-12 xs:h-10 md:h-14 px-6 xs:px-4 md:px-8 text-base xs:text-sm md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    Favoritos ({localFavorites.size})
                  </Button>
                </div>

                <div className="flex xs:flex-row gap-3 xs:gap-2 md:contents">
                  <Button
                    variant={filters.isSemiNew ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagFilter("isSemiNew")}
                    className="flex-1 xs:flex-1 md:flex-1 h-12 xs:h-10 md:h-14 px-6 xs:px-4 md:px-8 text-base xs:text-sm md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Semi Novo
                  </Button>

                  <Button
                    variant={filters.isZeroKm ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagFilter("isZeroKm")}
                    className="flex-1 xs:flex-1 md:flex-1 h-12 xs:h-10 md:h-14 px-6 xs:px-4 md:px-8 text-base xs:text-sm md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Zero KM
                  </Button>

                  <Button
                    variant={filters.isConsignment ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagFilter("isConsignment")}
                    className="flex-1 xs:flex-1 md:flex-1 h-12 xs:h-10 md:h-14 px-6 xs:px-4 md:px-8 text-base xs:text-sm md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Repasse
                  </Button>
                </div>
              </div>

              <div className="md:hidden mb-2">
                <div className="space-y-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filters.showAll ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("showAll")}
                      className="h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Estoque Completo
                    </Button>

                    <Button
                      variant={filters.showFavorites ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFavoritesFilter()}
                      className="h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Favoritos ({localFavorites.size})
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={filters.isSemiNew ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("isSemiNew")}
                      className="h-8 px-2 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Semi Novo
                    </Button>

                    <Button
                      variant={filters.isZeroKm ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("isZeroKm")}
                      className="h-8 px-2 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Zero KM
                    </Button>

                    <Button
                      variant={filters.isConsignment ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTagFilter("isConsignment")}
                      className="h-8 px-2 text-xs font-medium rounded-lg transition-all duration-200"
                    >
                      Repasse
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {isScrolled && (
              <div className="mb-2 md:hidden">
                <div
                  onClick={() => setIsStockOptionsExpanded(!isStockOptionsExpanded)}
                  className="flex items-center justify-end gap-1 py-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <span className="underline decoration-1 underline-offset-2">Opções de Estoque</span>
                  {isStockOptionsExpanded ? (
                    <ChevronUp className="h-2 w-2" />
                  ) : (
                    <ChevronDown className="h-2 w-2" />
                  )}
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isStockOptionsExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={filters.showAll ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagFilter("showAll")}
                        className="h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200"
                      >
                        Estoque Completo
                      </Button>

                      <Button
                        variant={filters.showFavorites ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFavoritesFilter()}
                        className="h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200"
                      >
                        Favoritos ({localFavorites.size})
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={filters.isSemiNew ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagFilter("isSemiNew")}
                        className="h-8 px-2 text-xs font-medium rounded-lg transition-all duration-200"
                      >
                        Semi Novo
                      </Button>

                      <Button
                        variant={filters.isZeroKm ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagFilter("isZeroKm")}
                        className="h-8 px-2 text-xs font-medium rounded-lg transition-all duration-200"
                      >
                        Zero KM
                      </Button>

                      <Button
                        variant={filters.isConsignment ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagFilter("isConsignment")}
                        className="h-8 px-2 text-xs font-medium rounded-lg transition-all duration-200"
                      >
                        Repasse
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={expandedContentRef}
            className="transform transition-all duration-300 ease-out"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-2 md:gap-5 mb-6">
              <Select
                value={filters.year}
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-lg">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem
                      key={year}
                      value={year}
                      className="text-base xs:text-xs md:text-lg"
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
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-lg">
                  <SelectValue placeholder="Combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Diesel"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Diesel
                  </SelectItem>
                  <SelectItem
                    value="Flex"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Flex
                  </SelectItem>
                  <SelectItem
                    value="Gasolina"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Gasolina
                  </SelectItem>
                  <SelectItem
                    value="Híbrido"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Híbrido
                  </SelectItem>
                  <SelectItem
                    value="Híbrido Plug-in"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Híbrido Plug-in
                  </SelectItem>
                  <SelectItem
                    value="Elétrico"
                    className="text-base xs:text-xs md:text-lg"
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
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-lg">
                  <SelectValue placeholder="Câmbio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Aut"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Automático
                  </SelectItem>
                  <SelectItem
                    value="Mec"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Manual
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-lg">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="SUV de Grande Porte"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    SUV de Grande Porte
                  </SelectItem>
                  <SelectItem
                    value="SUV de Médio Porte"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    SUV de Médio Porte
                  </SelectItem>
                  <SelectItem
                    value="SUV Compacto"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    SUV Compacto
                  </SelectItem>
                  <SelectItem
                    value="Picape Media"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Picape Media
                  </SelectItem>
                  <SelectItem
                    value="Picape Intermediaria"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Picape Intermediaria
                  </SelectItem>
                  <SelectItem
                    value="Sedan Popular"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Sedan Popular
                  </SelectItem>
                  <SelectItem
                    value="Hatch Popular"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Hatch Popular
                  </SelectItem>
                  <SelectItem
                    value="Hatch Premium"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Hatch Premium
                  </SelectItem>
                  <SelectItem
                    value="Utilitarios"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Utilitarios
                  </SelectItem>
                  <SelectItem
                    value="Sedan Medio"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Sedan Medio
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-3 p-3 bg-input/50 border border-border/50 rounded-lg h-11 xs:h-8 md:h-12">
                <Checkbox
                  id="blindagem"
                  checked={filters.isShielding === true}
                  onCheckedChange={(checked) => {
                    handleFilterChange("isShielding", checked ? true : undefined);
                  }}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="blindagem"
                  className="text-base xs:text-xs md:text-lg font-medium cursor-pointer flex-1"
                >
                  Apenas Blindados
                </label>
              </div>
            </div>

            <div className="mt-6 xs:mt-3 md:mt-8">
              <label className="text-sm xs:text-xs md:text-base font-medium text-muted-foreground mb-3 xs:mb-1 md:mb-4 block">
                Faixa de Preço: R$ {filters.priceRange[0].toLocaleString()} - R${
                  " "}
                {filters.priceRange[1].toLocaleString()}
              </label>
              <Slider
                defaultValue={[0, 1000000]}
                value={filters.priceRange}
                onValueChange={(value) =>
                  handleFilterChange("priceRange", value as [number, number])
                }
                max={1000000}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>

            <div className="relative flex justify-center mt-6 xs:mt-3 md:mt-8">
              <button
                onClick={() => setIsExpanded(false)}
                className="group flex flex-col items-center gap-1 py-2 px-4 rounded-t-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 border-t border-l border-r border-border/30"
              >
                <div className="w-8 h-1 bg-muted-foreground/40 rounded-full group-hover:bg-muted-foreground/60 transition-colors"></div>
                <ChevronUp className="h-4 w-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
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
      </div>
    </div>
  );
};

export default CarFilters;
