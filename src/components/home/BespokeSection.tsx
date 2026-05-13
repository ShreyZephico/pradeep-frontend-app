import Link from 'next/link';

export default function BespokeSection() {
  return (
    <section className="py-16 bg-amber-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-amber-400 text-sm tracking-wider mb-4">THE BESPOKE ATELIER</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Craft your dream.
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            From sketch to sacred heirloom in 21 days. Transparent pricing, pay only for the gold 
            weight plus a flat 12% making charge on bespoke orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bespoke" className="bg-white text-gray-900 px-8 py-3 font-semibold hover:bg-gray-100 transition">
              START YOUR DESIGN →
            </Link>
            <Link href="/whatsapp" className="border-2 border-white px-8 py-3 font-semibold hover:bg-white hover:text-gray-900 transition">
              WHATSAPP CONSULT
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}