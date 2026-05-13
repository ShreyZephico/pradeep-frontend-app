'use client';

import { useState, useEffect } from 'react';

const goldRate = 7160; // per gram in INR

// Helper function for consistent number formatting
function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function PricingSection() {
  const [weight, setWeight] = useState(20);
  const [purity, setPurity] = useState('22K');
  const [makingCharge, setMakingCharge] = useState('7');
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders on client after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goldValue = weight * goldRate;
  const makingValue = goldValue * (parseInt(makingCharge) / 100);
  const gst = (goldValue + makingValue) * 0.03;
  const total = goldValue + makingValue + gst;
  const marketAvg = total * 1.4;

  // Prevent hydration mismatch by showing placeholder during SSR
  if (!isMounted) {
    return (
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>{/* Left column placeholder */}</div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="animate-pulse">Loading calculator...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">TRANSPARENT PRICING</h2>
            <p className="text-xl text-amber-700 mb-6">Making charges starting at just 7%.</p>
            <p className="text-gray-700 mb-8">
              No hidden costs. No inflated wastage. Every invoice itemises metal, craft and finish — 
              exactly as it should be.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span>Design (Original CAD by senior designers)</span>
                <span className="font-semibold">+2%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span>Craft (Kolkata's master carvers)</span>
                <span className="font-semibold">+4%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-300">
                <span>Finish (Polish, hallmark & QC)</span>
                <span className="font-semibold">+1%</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">MARKET AVERAGE</div>
              <div className="text-lg font-bold">14–22% making + wastage</div>
              <div className="text-amber-600 font-semibold mt-2">You save up to 60% with Aurelia.</div>
            </div>
          </div>
          
          {/* Right Column - Calculator */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="font-serif text-2xl mb-6">LIVE ESTIMATE CALCULATOR</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Weight (grams)</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center font-bold mt-2">{weight}g</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Purity</label>
                <div className="flex gap-4">
                  {['22K', '24K'].map((k) => (
                    <button
                      key={k}
                      onClick={() => setPurity(k)}
                      className={`px-6 py-2 rounded transition ${
                        purity === k 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Making %</label>
                <div className="flex gap-2">
                  {['7', '10', '12'].map((mc) => (
                    <button
                      key={mc}
                      onClick={() => setMakingCharge(mc)}
                      className={`px-6 py-2 rounded transition ${
                        makingCharge === mc 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {mc}%
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>{purity} Gold ({weight}g)</span>
                  <span className="font-mono">₹{formatIndianCurrency(goldValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Making ({makingCharge}%)</span>
                  <span className="font-mono">₹{formatIndianCurrency(makingValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3%)</span>
                  <span className="font-mono">₹{formatIndianCurrency(gst)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Your price</span>
                  <span className="text-amber-600 font-mono">₹{formatIndianCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Market average</span>
                  <span className="line-through font-mono">₹{formatIndianCurrency(marketAvg)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}