import Link from 'next/link';

const giftRanges = [
  { price: '₹30k', items: 'Pendants, studs & charms', link: '#' },
  { price: '₹50k', items: 'Solitaires & Statements Sets', link: '#' },
  { price: '₹1L', items: 'Ring Jhumkas & Bracelets', link: '#' },
  { price: '₹2L', items: 'Bridal & Heirloom pieces', link: '#' },
];

const occasions = ['Engagement', 'Birthday', 'Anniversary', "Valentine's", 'Festival'];

export default function GiftingSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-4">THE GIFTING EDIT</h2>
        <p className="text-center text-gray-600 mb-12">Select your perfect gift.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {giftRanges.map((range, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-2xl font-bold text-amber-600 mb-2">GIFTS UNDER</div>
              <div className="text-3xl font-bold mb-2">{range.price}</div>
              <div className="text-gray-600 text-sm mb-4">{range.items}</div>
              <Link href={range.link} className="text-amber-600 text-sm">EXPLORE →</Link>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-amber-50 p-8 rounded-lg text-center">
            <h3 className="font-serif text-2xl mb-4">PERSONAL STYLIST</h3>
            <Link href="/stylist" className="text-amber-600">GET STARTED →</Link>
          </div>
          
          <div className="bg-amber-50 p-8 rounded-lg text-center">
            <h3 className="font-serif text-2xl mb-4">GIFTS FOR ANNIVERSARY</h3>
            <p className="text-gray-600 mb-4">Handpicked pieces that turn moments into memories</p>
            <Link href="/anniversary" className="text-amber-600">SHOP ANNIVERSARY →</Link>
          </div>
        </div>
        
        {/* Occasions */}
        <div className="mt-8">
          <h4 className="text-center text-sm font-semibold mb-4">EXPLORE BY OCCASION</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {occasions.map((occasion) => (
              <Link key={occasion} href={`/occasion/${occasion.toLowerCase()}`} className="text-gray-600 hover:text-amber-600 text-sm">
                {occasion}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}