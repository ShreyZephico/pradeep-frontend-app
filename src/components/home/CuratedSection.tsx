import Link from 'next/link';
import Image from 'next/image';

const products = [
  { name: 'Aanya Bridal Kada', price: '₹1,28,000', tag: 'NEW' as const },
  { name: 'Kalki Mangalsutra', price: '₹1,28,000', tag: 'NEW' as const },
  { name: 'Stellar Solitaire Studs', price: '₹62,000', tag: 'BESTSELLER' as const },
  { name: 'Zumurrud Emerald Ring', price: '₹96,500', tag: 'BESTSELLER' as const },
  { name: 'Payal Whisper Anklet', price: '₹6,800', tag: 'BESTSELLER' as const },
  { name: 'Aanya Bridal Kada', price: '₹1,28,000', tag: 'BESTSELLER' as const },
];

export default function CuratedSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h3 className="font-serif text-3xl md:text-4xl font-light">Curated for you.</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {products.map((product, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm mb-3">
                {product.tag && (
                  <span className={`absolute top-2 left-2 z-10 px-2 py-1 text-xs font-semibold ${
                    product.tag === 'NEW' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    {product.tag}
                  </span>
                )}
                <div className="w-full h-full bg-gray-200"></div>
              </div>
              <h4 className="font-medium text-sm">{product.name}</h4>
              <p className="text-amber-600 font-semibold mt-1">{product.price}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/collection" className="inline-block border-2 border-gray-800 px-8 py-3 hover:bg-gray-800 hover:text-white transition">
            BROWSE FULL COLLECTION
          </Link>
        </div>
      </div>
    </section>
  );
}