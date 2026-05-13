import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-amber-900 to-amber-800 text-white">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl">
          <p className="text-amber-300 text-sm tracking-wider mb-4">THE BRIDAL SEASON</p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Reimagined in <br />
            <span className="text-amber-400">22 karat</span>
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Our iconic 11+1 gold purchase plan. Rooted in trust, measured in grams, 
            the heirloom way to save.
          </p>
          <Link 
            href="/scheme" 
            className="inline-block bg-amber-600 hover:bg-amber-700 px-8 py-3 rounded-md font-semibold transition"
          >
            ENROL IN 11+1 →
          </Link>
        </div>
      </div>
    </section>
  );
}