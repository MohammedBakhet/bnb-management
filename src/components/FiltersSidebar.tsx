// src/app/filter/FiltersSidebar.tsx

interface FiltersSidebarProps {
  filters: {
    priceRange: [number, number];
    location: string;
    amenities: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    priceRange: [number, number];
    location: string;
    amenities: string[];
  }>>;
}

export default function FiltersSidebar({ filters, setFilters }: FiltersSidebarProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const newRange = e.target.name === 'min' ? [value, filters.priceRange[1]] : [filters.priceRange[0], value];
    setFilters({ ...filters, priceRange: newRange as [number, number] });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, location: e.target.value });
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amenity = e.target.value;
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    setFilters({ ...filters, amenities: newAmenities });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Filters</h3>

      <div>
        <h4 className="text-lg font-medium">Price Range</h4>
        <label>
          Min:
          <input type="number" name="min" value={filters.priceRange[0]} onChange={handlePriceChange} className="w-full px-2 py-1 border rounded" />
        </label>
        <label>
          Max:
          <input type="number" name="max" value={filters.priceRange[1]} onChange={handlePriceChange} className="w-full px-2 py-1 border rounded" />
        </label>
      </div>

      <div>
        <h4 className="text-lg font-medium">Location</h4>
        <input type="text" value={filters.location} onChange={handleLocationChange} className="w-full px-2 py-1 border rounded" />
      </div>

      <div>
        <h4 className="text-lg font-medium">Amenities</h4>
        <label>
          <input type="checkbox" value="Free Wifi" checked={filters.amenities.includes('Free Wifi')} onChange={handleAmenityChange} />
          Free Wifi
        </label>
        <label>
          <input type="checkbox" value="Swimming Pool" checked={filters.amenities.includes('Swimming Pool')} onChange={handleAmenityChange} />
          Swimming Pool
        </label>
        {/* Add more amenities as needed */}
      </div>
    </div>
  );
}
