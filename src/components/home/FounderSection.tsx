import Link from 'next/link';

export default function FounderSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square bg-gray-300 rounded-lg"></div>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">THE FOUNDER</h2>
            <p className="text-xl text-amber-700 mb-4">A goldsmith's son. A father's promise.</p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              "We don't sell jewellery. We hand over a piece of someone's wedding day, their daughter's 
              first earrings, their grandmother's memory."
            </p>
            <p className="text-gray-600 mb-6">
              Ramesh Agarwal opened a single bench in Bowbazar in 1984 with three karigars and one promise: 
              every gram, weighed honestly. Forty years on, his sons run the same bench — and the same promise.
            </p>
            <Link href="/story" className="text-amber-600 font-semibold hover:text-amber-700">
              READ OUR FULL STORY →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}