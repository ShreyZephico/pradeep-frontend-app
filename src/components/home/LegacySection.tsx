'use client';

import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const stats = [
  { label: 'Years of Heritage', value: 40, suffix: '+', description: 'Since 1972' },
  { label: 'Families Served', value: 50000, suffix: '+', description: 'Across three generations' },
  { label: 'BIS Hallmarked', value: 100, suffix: '%', description: 'Every gram, certified' },
  { label: 'of Making Charge', value: 7, suffix: '%', description: 'Since 1972' },
  { label: 'Master Artisans', value: 50, suffix: '+', description: 'In-house atelier' },
];

export default function LegacySection() {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  return (
    <section className="py-16 bg-amber-50" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm tracking-wider mb-2">— A LEGACY OF TRUST —</p>
          <h3 className="font-serif text-3xl md:text-4xl font-light">
            Three generations, one promise - purity.
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl md:text-4xl font-bold text-amber-700">
                {inView ? (
                  <CountUp end={stat.value} duration={2.5} />
                ) : (
                  stat.value
                )}
                {stat.suffix}
              </div>
              <div className="font-semibold mt-2">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}