import Link from 'next/link';

export default function SocialSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">@AURELIAJEWELLERS</h2>
        <p className="text-gray-600 mb-8">Follow the journey of every piece.</p>
        <p className="max-w-2xl mx-auto text-gray-700 mb-8">
          Behind-the-bench reels, festive lookbooks, and first looks at new collections — 
          across Instagram and our WhatsApp Broadcast.
        </p>
        
        <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Join our WhatsApp Broadcast</h3>
          <p className="text-sm text-gray-600 mb-4">First access to schemes, festive drops & private viewings.</p>
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="WhatsApp number"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}