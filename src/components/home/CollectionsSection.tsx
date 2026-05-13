'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  'Gold Jewellery',
  'Diamond Jewellery',
  'Silver',
  'Gemstones',
  'Spiritual',
  'Bespoke',
];

export default function CollectionsSection() {
  const [activeCategory, setActiveCategory] = useState('Gold Jewellery');
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light">THE COLLECTIONS</h2>
            <p className="text-gray-600 mt-2">Find what speaks to you.</p>
          </div>
          <Link href="/products" className="text-amber-600 hover:text-amber-700">
            VIEW ALL →
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm transition ${
                activeCategory === category
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Category content would go here - add your product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="aspect-square bg-gray-100 rounded-lg"></div>
          <div className="aspect-square bg-gray-100 rounded-lg"></div>
          <div className="aspect-square bg-gray-100 rounded-lg"></div>
          <div className="aspect-square bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}