import { useState, useEffect } from "react";
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
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface FilterProps {
  onFilterChange: (filters: CarFilters) => void;
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
  isShielding: boolean | undefined;
  isSemiNovo: boolean;
  isZeroKm: boolean;
  isConsignment: boolean;
  showAll: boolean;
}

const CarFilters = ({ onFilterChange }: FilterProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<CarFilters>({
    model: "",
    priceMin: "",
    priceMax: "",
    priceRange: [0, 1000000],
    year: "",
    searchTerm: "",
    fuelType: "",
    transmission: "",
    isShielding: undefined,
    isSemiNovo: false,
    isZeroKm: false,
    isConsignment: false,
    showAll: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      const filtersElement = document.getElementById("filters");
      if (filtersElement) {
        const rect = filtersElement.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterChange = (
    key: keyof CarFilters,
    value: string | boolean | [number, number]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagFilter = (
    tag: "isSemiNovo" | "isZeroKm" | "isConsignment" | "showAll"
  ) => {
    let newFilters = { ...filters };

    if (tag === "showAll") {
      newFilters = {
        ...filters,
        isSemiNovo: false,
        isZeroKm: false,
        isConsignment: false,
        showAll: true,
      };
    } else {
      newFilters = {
        ...filters,
        [tag]: !filters[tag],
        showAll: false,
      };

      // Se nenhum filtro específico estiver ativo, ativar "showAll"
      if (
        !newFilters.isSemiNovo &&
        !newFilters.isZeroKm &&
        !newFilters.isConsignment
      ) {
        newFilters.showAll = true;
      }
    }

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
      isShielding: undefined,
      isSemiNovo: false,
      isZeroKm: false,
      isConsignment: false,
      showAll: true,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const brands = [
    "Audi",
    "BMW",
    "Mercedes-Benz",
    "Porsche",
    "Ferrari",
    "Lamborghini",
    "McLaren",
    "Tesla",
  ];
  const years = Array.from({ length: 15 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  return (
    <div
      id="filters"
      className={`${
        isSticky ? "filter-sticky" : ""
      } py-4 px-4 bg-gradient-card border-b border-border/50`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 xs:gap-1">
            <SlidersHorizontal className="h-5 w-5 xs:h-3 xs:w-3 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl xs:text-base md:text-2xl font-semibold">
              Filtrar Veículos
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 xs:gap-0.5 text-sm xs:text-xs md:text-base px-3 xs:px-1 md:px-4 h-9 xs:h-7 md:h-10"
          >
            {isExpanded ? "Ocultar" : "Mostrar"} Filtros
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 xs:h-2.5 xs:w-2.5 md:h-5 md:w-5" />
            ) : (
              <ChevronDown className="h-4 w-4 xs:h-2.5 xs:w-2.5 md:h-5 md:w-5" />
            )}
          </Button>
        </div>

        {/* Filtros Rápidos por Tags - Sempre Visíveis */}
        <div className="mb-6">
          <h3 className="text-sm xs:text-xs md:text-base font-medium text-muted-foreground mb-4 xs:mb-2 md:mb-5 text-center">
            Filtros Rápidos
          </h3>
          <div className="max-w-4xl mx-auto">
            {/* Estoque Completo - Largura total no mobile */}
            <div className="mb-3 xs:mb-2 md:mb-0">
              <Button
                variant={filters.showAll ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagFilter("showAll")}
                className="w-full md:w-auto h-12 xs:h-10 md:h-14 px-6 xs:px-4 md:px-8 text-base xs:text-sm md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Estoque Completo
              </Button>
            </div>
            
            {/* Outras 3 tags lado a lado no mobile */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 xs:gap-1 md:gap-4">
              <div className="md:col-start-2">
                <Button
                   variant={filters.isSemiNovo ? "default" : "outline"}
                   size="sm"
                   onClick={() => handleTagFilter("isSemiNovo")}
                   className="w-full h-12 xs:h-8 md:h-14 px-2 xs:px-1 md:px-8 text-base xs:text-xs md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                 >
                   Semi Novo
                 </Button>
              </div>
              <Button
                 variant={filters.isZeroKm ? "default" : "outline"}
                 size="sm"
                 onClick={() => handleTagFilter("isZeroKm")}
                 className="w-full h-12 xs:h-8 md:h-14 px-2 xs:px-1 md:px-8 text-base xs:text-xs md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
               >
                 Zero KM
               </Button>
              <Button
                 variant={filters.isConsignment ? "default" : "outline"}
                 size="sm"
                 onClick={() => handleTagFilter("isConsignment")}
                 className="w-full h-12 xs:h-8 md:h-14 px-2 xs:px-1 md:px-8 text-base xs:text-xs md:text-lg font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
               >
                 Consignação
               </Button>
            </div>
          </div>

          {/* Campo de Busca Rápida por Título */}
          <div className="mt-8 xs:mt-4 md:mt-10 max-w-lg xs:max-w-md md:max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 xs:left-2 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 xs:h-3 xs:w-3 md:h-6 md:w-6 text-muted-foreground" />
              <Input
                placeholder="Buscar por título do veículo..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="pl-10 xs:pl-7 md:pl-12 h-12 xs:h-8 md:h-14 text-base xs:text-xs md:text-lg bg-input/50 border-border/50 focus:border-primary/50 focus:bg-input transition-all rounded-xl shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Filtros Detalhados - Expansíveis */}
        {isExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-2 md:gap-5">
              {/* Year */}
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

              {/* Fuel Type */}
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
                    value="Híbrido"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Híbrido
                  </SelectItem>
                  <SelectItem
                    value="Flex"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Flex
                  </SelectItem>
                  <SelectItem
                    value="Sistema Híbrido Plugin"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Sistema Híbrido Plugin
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Transmission */}
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

              {/* Shielding */}
              <Select
                value={
                  filters.isShielding === undefined
                    ? "todos"
                    : filters.isShielding
                    ? "true"
                    : "false"
                }
                onValueChange={(value) => {
                  if (value === "todos") {
                    handleFilterChange("isShielding", undefined);
                  } else {
                    handleFilterChange("isShielding", value === "true");
                  }
                }}
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50 h-11 xs:h-8 md:h-12 text-base xs:text-xs md:text-lg">
                  <SelectValue placeholder="Blindagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="todos"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Todos
                  </SelectItem>
                  <SelectItem
                    value="true"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Blindagem - Sim
                  </SelectItem>
                  <SelectItem
                    value="false"
                    className="text-base xs:text-xs md:text-lg"
                  >
                    Blindagem - Não
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 xs:mt-3 md:mt-8">
              <label className="text-sm xs:text-xs md:text-base font-medium text-muted-foreground mb-3 xs:mb-1 md:mb-4 block">
                Faixa de Preço: R$ {filters.priceRange[0].toLocaleString()} - R${" "}
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

            <div className="flex justify-end mt-6 xs:mt-3 md:mt-8">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-border/50 hover:bg-destructive/10 hover:border-destructive/50 transition-all h-10 xs:h-7 md:h-12 px-6 xs:px-2 md:px-8 text-base xs:text-xs md:text-lg"
              >
                Limpar Filtros
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarFilters;
