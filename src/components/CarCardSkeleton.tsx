const CarCardSkeleton = () => {
  return (
    <div className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col xs:flex-row md:flex-col xs:h-28 md:h-[500px] bg-white rounded-lg border animate-pulse">
      {/* Image skeleton */}
      <div className="relative xs:h-28 md:h-80 overflow-hidden bg-gray-200 xs:w-2/5 md:w-full">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        
        {/* Badge skeleton */}
        <div className="absolute top-1 right-1 xs:top-1 xs:right-1 z-10">
          <div className="bg-gray-300 rounded-full px-2 py-1 w-12 h-5"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-2 xs:p-1 xs:w-3/5 xs:flex xs:flex-col xs:justify-between md:w-full md:p-4 relative">
        <div className="xs:flex xs:flex-col xs:h-full xs:justify-between">
          <div>
            {/* Title skeleton */}
            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
            
            {/* Details skeleton */}
            <div className="flex flex-wrap gap-1 xs:gap-0.5 mb-2 xs:mb-1">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-200 rounded w-12 ml-1"></div>
              <div className="h-5 bg-gray-200 rounded w-20 ml-1"></div>
            </div>
            
            {/* Price skeleton */}
            <div className="h-6 bg-gray-300 rounded mb-2 w-24"></div>
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex gap-1 xs:gap-0.5 xs:mt-1">
            <div className="h-8 bg-gray-200 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardSkeleton;