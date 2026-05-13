'use client';

import { useState, useEffect } from 'react';
import ProductsPageClient from '@/components/ProductsPageClient';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        setError(data.error || 'Failed to load products');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProducts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7efe3]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9F2B68]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7efe3]">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[#2f1c12] mb-2">Unable to Load Products</h2>
          <p className="text-[#765f4a] mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-2 bg-[#9F2B68] text-white rounded-full hover:bg-[#7a1f4f] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <ProductsPageClient products={products} />;
}
