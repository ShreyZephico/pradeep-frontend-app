import Link from 'next/link';

const articles = [
  { category: 'ASTROLOGY', title: 'How do I choose the right gemstone?', readTime: '5 min', link: '#' },
  { category: 'DIAMONDS', title: 'What are the 4Cs of diamonds?', readTime: '7 min', link: '#' },
  { category: 'SIZING', title: 'Which ring size will fit perfectly?', readTime: '3 min', link: '#' },
  { category: 'SILVER', title: 'How is sterling silver (925) tested?', readTime: '4 min', link: '#' },
];

export default function LearnSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-4">LEARN WITH US</h2>
          <p className="text-gray-600 text-lg">Buy with knowledge, cherish for generations.</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <Link key={index} href={article.link} className="group">
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-amber-600 text-sm font-semibold mb-2">{article.category}</div>
                <h3 className="font-semibold text-lg mb-3 group-hover:text-amber-600 transition">
                  {article.title}
                </h3>
                <div className="text-gray-500 text-sm">Read {article.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}