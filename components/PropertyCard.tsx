
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            {property.type}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="px-4 py-2 bg-slate-900 text-white text-lg font-bold rounded-lg shadow-lg">
            ${property.price.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-1">{property.title}</h3>
        <p className="text-slate-500 flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          {property.location}
        </p>
        <div className="flex justify-between items-center py-4 border-t border-slate-50">
          <div className="text-center">
            <span className="block text-slate-900 font-bold">{property.beds}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-widest">Beds</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="text-center">
            <span className="block text-slate-900 font-bold">{property.baths}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-widest">Baths</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="text-center">
            <span className="block text-slate-900 font-bold">{property.sqft.toLocaleString()}</span>
            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-widest">Sq Ft</span>
          </div>
        </div>
        <button className="w-full mt-2 py-3 border border-slate-900 text-slate-900 font-semibold rounded-xl hover:bg-slate-900 hover:text-white transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
