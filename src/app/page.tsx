'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaHome, FaSlidersH } from 'react-icons/fa'; 

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrls: string[];
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data: Property[] = await res.json();
        setProperties(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []);

  const mostPickedProperties = properties.slice(0, 3);

  const cheapestProperties = [...properties].sort((a, b) => a.pricePerNight - b.pricePerNight).slice(0, 3);

  return (
    <div className="container mx-auto px-6 py-12">
 
      <section className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-bold text-gray-800 leading-tight">
            Discover Your Dream Stay
          </h2>
          <p className="mt-4 text-gray-600">
            Welcome to our unique BnB! Enjoy a cozy stay and explore the surroundings at your own pace. Perfect for a
            relaxing weekend or an extended holiday.
          </p>
          <Link href="/filter">
            <button className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700">
              Show Me Now
            </button>
          </Link>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          <img
            src="https://img.staticmb.com/mbcontent/images/crop/uploads/2022/12/Most-Beautiful-House-in-the-World_0_1200.jpg"
            alt="Vacation House"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <FaShieldAlt className="text-3xl text-gray-800 mb-4 mx-auto" />
          <h4 className="text-xl font-semibold text-gray-800">Få lite flexibilitet</h4>
          <p className="text-gray-600 mt-2">
            Boenden med flexibel avbokning gör det enkelt att omboka om dina planer ändras.
          </p>
        </div>
        <div>
          <FaHome className="text-3xl text-gray-800 mb-4 mx-auto" />
          <h4 className="text-xl font-semibold text-gray-800">Mer än sju miljoner aktiva annonser</h4>
          <p className="text-gray-600 mt-2">
            Gör som 1 miljard andra gäster som har hittat semesterbostäder i över 220 länder och resmål.
          </p>
        </div>
        <div>
          <FaSlidersH className="text-3xl text-gray-800 mb-4 mx-auto" />
          <h4 className="text-xl font-semibold text-gray-800">Över 3 filter för skräddarsydda vistelser</h4>
          <p className="text-gray-600 mt-2">
            Välj prisklass, antal rum du vill ha och andra viktiga bekvämligheter för att hitta det boende som passar dina behov.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800">Most Picked</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mostPickedProperties.length > 0 ? (
            mostPickedProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <img
                    src={property.imageUrls[0] || '/default-image.jpg'}
                    alt={property.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-semibold">{property.name}</h4>
                    <p className="text-gray-600 mt-2">{property.description}</p>
                    <p className="text-gray-500">{property.location}</p>
                    <p className="text-purple-600 font-bold mt-2">${property.pricePerNight} / night</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No properties available.</p>
          )}
        </div>
      </section>

      <section className="mt-12 flex justify-center">
        <img
          src="https://img.staticmb.com/mbcontent/images/crop/uploads/2022/12/Most-Beautiful-House-in-the-World_0_1200.jpg" 
          alt="Scenic Central Image"
          className="w-full max-w-4xl rounded-lg shadow-lg"
        />
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800">Cheapest Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {cheapestProperties.length > 0 ? (
            cheapestProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <img
                    src={property.imageUrls[0] || '/default-image.jpg'}
                    alt={property.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-xl font-semibold">{property.name}</h4>
                    <p className="text-gray-600 mt-2">{property.description}</p>
                    <p className="text-gray-500">{property.location}</p>
                    <p className="text-purple-600 font-bold mt-2">${property.pricePerNight} / night</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No properties available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
