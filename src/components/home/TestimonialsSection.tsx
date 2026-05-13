'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Priya Banerjee',
    title: 'BRIDAL SET · CUSTOM BRIDAL SET · 22K',
    content: 'The temple choker they crafted for my wedding was beyond what I sketched. Every aunt asked which family heirloom it was.',
    rating: 5,
  },
  {
    name: 'Mrs. Sengupta',
    title: 'ANNIVERSARY · DIAMOND SOLITAIRE · 18K',
    content: 'Three generations of my family have bought from Aurelia. The trust is in every gram — exactly what\'s billed is exactly what you wear.',
    rating: 5,
  },
  {
    name: 'Riya & Arjun',
    title: 'WEDDING · MANGALSUTRA · 22K',
    content: 'From design call on WhatsApp to delivery in 19 days. The making charges were a third of what we were quoted elsewhere.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">IN THEIR WORDS</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <span className="text-2xl font-bold ml-2">4.9</span>
            <span className="text-gray-600">/ 5</span>
            <span className="text-gray-600 ml-2">2,416 GOOD REVIEWS</span>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex text-amber-500 mb-4">
              {[...Array(testimonials[current].rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <p className="text-gray-700 text-lg mb-6 italic">"{testimonials[current].content}"</p>
            <div className="font-semibold">{testimonials[current].name}</div>
            <div className="text-sm text-gray-500">{testimonials[current].title}</div>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition ${
                  current === index ? 'bg-amber-600 w-4' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}