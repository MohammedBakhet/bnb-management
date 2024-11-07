// src/app/filter/PropertyCard.tsx

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    description: string;
    location: string;
    pricePerNight: number;
    imageUrls: string[];
    amenities: string[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md mt-6">
      {/* Image Section */}
      <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
        <img
          src={property.imageUrls[0] || '/default-image.jpg'}
          alt={property.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Info Section */}
      <div className="p-6">
        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
          {property.name}
        </h5>
        <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
          {property.description}
        </p>
        <p className="text-sm font-sans text-gray-500 mt-2">{property.location}</p>
        <p className="text-purple-600 font-bold mt-2">${property.pricePerNight} / night</p>
      </div>

      {/* Button Section */}
      <div className="p-6 pt-0">
        <button
          data-ripple-light="true"
          type="button"
          className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Read More
        </button>
      </div>
    </div>
  );
}
