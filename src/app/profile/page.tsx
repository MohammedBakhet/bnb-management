'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrls: string[];
  amenities: string[];
  ownerId: string;
}

export default function ProfilePage() {
  const { user, isAdmin } = useAuth(); // Access isAdmin
  const [properties, setProperties] = useState<Property[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [amenities, setAmenities] = useState('');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<FileList | null>(null);

  // Fetch properties on page load
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data: Property[] = await res.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('pricePerNight', pricePerNight);
    formData.append('ownerId', user?.id || '');
    amenities.split(',').forEach((amenity) => formData.append('amenities', amenity.trim()));
    if (images) {
      Array.from(images).forEach((file) => formData.append('images', file));
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const newProperty: Property = await res.json();
        setProperties([...properties, newProperty]);
        setName('');
        setDescription('');
        setLocation('');
        setPricePerNight('');
        setAmenities('');
        setImages(null);
      } else {
        console.error('Failed to add property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProperties(properties.filter((property) => property.id !== id));
      } else {
        console.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setName(property.name);
    setDescription(property.description);
    setLocation(property.location);
    setPricePerNight(property.pricePerNight.toString());
    setAmenities(property.amenities.join(', '));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('pricePerNight', pricePerNight);
    amenities.split(',').forEach((amenity) => formData.append('amenities', amenity.trim()));
    if (images) {
      Array.from(images).forEach((file) => formData.append('images', file));
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/properties/${editingProperty.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updatedProperty = await res.json();
        setProperties(
          properties.map((property) =>
            property.id === updatedProperty.id ? updatedProperty : property
          )
        );
        setEditingProperty(null);
        setName('');
        setDescription('');
        setLocation('');
        setPricePerNight('');
        setAmenities('');
        setImages(null);
      } else {
        console.error('Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8">Your Properties</h2>

      <form onSubmit={editingProperty ? handleUpdate : handleSubmit} className="mb-12 space-y-4 bg-gray-100 p-6 rounded-lg shadow-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Property Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        ></textarea>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          placeholder="Price per Night"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
          placeholder="Amenities (comma separated)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          {editingProperty ? 'Update Property' : 'Add Property'}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-200 ease-in-out">
              <Link href={`/properties/${property.id}`}>
                <img
                  src={property.imageUrls[0] || '/default-image.jpg'}
                  alt={property.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-4 cursor-pointer"
                />
              </Link>
              <h3 className="text-xl font-semibold">{property.name}</h3>
              <p className="text-gray-600 mb-2">{property.description}</p>
              <p className="text-gray-500">{property.location}</p>
              <p className="text-purple-600 font-bold mb-4">${property.pricePerNight} / night</p>
              <p className="text-gray-500 mb-4">Amenities: {property.amenities.join(', ')}</p>
              {(user?.id === property.ownerId || isAdmin) && (
                <>
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 mt-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="mt-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No properties found.</p>
        )}
      </div>
    </div>
  );
}
