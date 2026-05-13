'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const clearanceProducts = [
  { name: 'Zumurrud Emerald Ring', price: '₹86,500' },
  { name: 'Devi Temple Jhumka', price: '₹54,200' },
  { name: 'Kalki Mangalsutra', price: '₹84,500' },
];

export default function GoldSchemeSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 6, hours: 3, minutes: 59, seconds: 57 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">11 + 1 GOLD SCHEME</h2>
            <p className="text-3xl font-light mb-6">Pay 11. Get 12.</p>
            <p className="text-gray-300 mb-8">
              Choose your monthly contribution. We add the final month — in pure gold value.
            </p>
            
            <div className="grid grid-cols-6 gap-2 mb-8">
              {['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', '+1'].map((month, i) => (
                <div key={i} className={`text-center p-2 rounded ${month === '+1' ? 'bg-amber-600' : 'bg-amber-700'}`}>
                  {month}
                </div>
              ))}
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm">Monthly contribution</div>
                  <div className="text-2xl font-bold">₹5,000</div>
                </div>
                <div className="text-2xl">→</div>
                <div>
                  <div className="text-sm">YOU PAY 11 (IN MONEY)</div>
                  <div className="text-2xl font-bold">₹55,000</div>
                </div>
                <div className="text-2xl">+</div>
                <div>
                  <div className="text-sm">WE ADD</div>
                  <div className="text-2xl font-bold text-amber-400">₹5,000</div>
                </div>
                <div className="text-2xl">=</div>
                <div>
                  <div className="text-sm">TOTAL VALUE</div>
                  <div className="text-2xl font-bold">₹60,000</div>
                </div>
              </div>
            </div>
            
            <Link href="/whatsapp" className="inline-block bg-white text-gray-900 px-8 py-3 font-semibold mt-6 hover:bg-gray-100 transition">
              JOIN VIA WHATSAPP
            </Link>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">STOCK CLEARANCE ENDS IN</h3>
            <div className="flex gap-4 justify-center mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-sm">DAYS</div>
              </div>
              <div className="text-3xl">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-sm">HRS</div>
              </div>
              <div className="text-3xl">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-sm">MIN</div>
              </div>
              <div className="text-3xl">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-sm">SEC</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {clearanceProducts.map((product, i) => (
                <div key={i} className="text-center">
                  <div className="aspect-square bg-white/10 rounded-lg mb-2"></div>
                  <div className="text-sm">{product.name}</div>
                  <div className="font-bold">{product.price}</div>
                </div>
              ))}
            </div>
            <Link href="/clearance" className="block text-center mt-4 text-amber-400">View all clearance →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}