import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <h3 className="text-white font-serif text-2xl mb-4">Pradeep Jewellers</h3>
            <p className="text-sm mb-4">
              CRAFTING DREAMS SINCE 1972
            </p>
            <p className="text-xs">
              A family of goldsmiths crafting heirlooms from our Chennai atelier since 1972. 
              BIS hallmarked. Always honestly weighed.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">SHOP</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/bridal">Bridal</Link></li>
              <li><Link href="/rings">Rings</Link></li>
              <li><Link href="/necklaces">Necklaces</Link></li>
              <li><Link href="/earrings">Earrings</Link></li>
              <li><Link href="/bangles">Bangles</Link></li>
              <li><Link href="/everyday">Everyday</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">HOUSE OF PRADEEP</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/story">Our Story</Link></li>
              <li><Link href="/ateliers">Ateliers</Link></li>
              <li><Link href="/craftsmanship">Craftsmanship</Link></li>
              <li><Link href="/press">Press</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/sustainability">Sustainability</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-3">SERVICES</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/bespoke">Bespoke</Link></li>
              <li><Link href="/scheme">11+1 Scheme</Link></li>
              <li><Link href="/buyback">Lifetime Buyback</Link></li>
              <li><Link href="/exchange">Gold Exchange</Link></li>
              <li><Link href="/appraisal">Appraisal</Link></li>
              <li><Link href="/care">Care Guide</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-4 md:mb-0">
              <p>FLAGSHIP - CHENNAI</p>
              <p>24, Ranganathan Street, T. Nagar, Chennai 600017</p>
              <p>+91 44 2834 5678 | atelier@pradeepjewellers.com</p>
            </div>
            <Link href="/whatsapp" className="bg-green-600 text-white px-6 py-2 rounded-full text-sm">
              CHAT ON WHATSAPP
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          <p>© 2024 Pradeep Jewellers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}