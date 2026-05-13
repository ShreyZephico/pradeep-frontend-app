'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';
import ProductModal from '@/components/ProductModal';

type ProductsPageClientProps = {
  products: Product[];
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductsPageClient({ products }: ProductsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'rings', name: 'Rings' },
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'earrings', name: 'Earrings' },
    { id: 'bracelets', name: 'Bracelets' },
  ];

  const filteredProducts = products.filter((product) => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      const name = product.name.toLowerCase();
      if (selectedCategory === 'rings') {
        matchesCategory = name.includes('ring');
      } else if (selectedCategory === 'necklaces') {
        matchesCategory = name.includes('necklace') || name.includes('chain');
      } else if (selectedCategory === 'earrings') {
        matchesCategory = name.includes('earring');
      } else if (selectedCategory === 'bracelets') {
        matchesCategory = name.includes('bracelet') || name.includes('bangle');
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const getProductImage = (product: Product) => {
    if (imageErrors[product.id]) {
      return '/placeholder.jpg';
    }
    return product.image || '/placeholder.jpg';
  };

  return (
    <div className="min-h-screen bg-[#f7efe3]">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2f1c12] to-[#4a2b17] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
          <p className="text-lg text-[#d8bd8a] max-w-2xl mx-auto">
            Discover our exquisite range of fine jewellery, crafted with passion and precision
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Search and Filter Section */}
        <div className="mb-10">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full px-5 py-3 pl-12 rounded-full border border-[#eadcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#9F2B68] focus:border-transparent text-[#2f1c12]"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9d8a76]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-[#9F2B68] text-white shadow-lg'
                    : 'bg-white text-[#4a2b17] border border-[#d8bd8a] hover:bg-[#fff4d8]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-[#765f4a]">
            Showing <span className="font-semibold text-[#2f1c12]">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-[#2f1c12]">{products.length}</span> pieces
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-[#9F2B68] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#eadcc8]">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#2f1c12] mb-2">No pieces found</h3>
            <p className="text-[#765f4a]">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-6 py-2 bg-[#9F2B68] text-white rounded-full hover:bg-[#7a1f4f] transition"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-[#fbf4ea] to-[#f4e7d7] overflow-hidden">
                  {getProductImage(product) !== '/placeholder.jpg' ? (
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={() => handleImageError(product.id)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl">💎</span>
                    </div>
                  )}
                  
                  {/* Badge */}
                  {product.compareAtPrice > product.price && (
                    <span className="absolute top-3 left-3 bg-[#9F2B68] text-white text-xs font-bold px-2 py-1 rounded-full">
                      Sale
                    </span>
                  )}
                  
                  {/* Variant count badge */}
                  {product.variants && product.variants.length > 1 && (
                    <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {product.variants.length} options
                    </span>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[#2f1c12] line-clamp-1 group-hover:text-[#9F2B68] transition">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#765f4a] mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#9F2B68]">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice > product.price && (
                        <span className="ml-2 text-sm text-[#b39d86] line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="px-4 py-2 rounded-full bg-[#2f1c12] text-white text-sm font-semibold hover:bg-[#9F2B68] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
