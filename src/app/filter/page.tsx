'use client';

import { useEffect, useState } from 'react';
import FiltersSidebar from '@/components/FiltersSidebar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrls: string[];
  amenities: string[];
}

interface Filters {
  priceRange: [number, number];
  location: string;
  amenities: string[];
}

export default function FilterPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 30000],
    location: '',
    amenities: [],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data: Property[] = await res.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = properties.filter((property) => {
        const matchesPrice = property.pricePerNight >= filters.priceRange[0] && property.pricePerNight <= filters.priceRange[1];
        const matchesLocation = filters.location ? property.location.includes(filters.location) : true;
        const matchesAmenities = filters.amenities.every((amenity) => property.amenities.includes(amenity));
        const matchesSearch = searchQuery
          ? property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        return matchesPrice && matchesLocation && matchesAmenities && matchesSearch;
      });
      setFilteredProperties(filtered);
    };
    applyFilters();
  }, [filters, properties, searchQuery]); // Include searchQuery in dependency array

  return (
    <div className="flex">
      {/* Sidebar Filter Section */}
      <div className="w-1/4 p-4">
        <FiltersSidebar filters={filters} setFilters={setFilters} />
      </div>

      {/* Main Content Section */}
      <div className="w-3/4 p-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <h2 className="text-2xl font-semibold mb-4">
          Showing {filteredProperties.length} properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <PropertyCard property={property} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
