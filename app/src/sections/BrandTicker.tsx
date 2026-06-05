import { Star } from 'lucide-react';

const tickerItems = [
  '40 YEARS OF TRUST',
  'PREMIUM ETHNIC WEAR',
  'SAME DAY DELIVERY IN JALGAON',
  'EXPERT FITTING SERVICE',
  'WEDDING COLLECTION',
];

export default function BrandTicker() {
  return (
    <div className="bg-gold py-4 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-track">
          {/* First set */}
          {tickerItems.map((item, i) => (
            <div key={`a-${i}`} className="inline-flex items-center px-6 md:px-12">
              <Star size={10} className="text-charcoal/60 mr-4 fill-charcoal/60" />
              <span className="font-body text-sm font-semibold text-charcoal tracking-[0.1em] whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {tickerItems.map((item, i) => (
            <div key={`b-${i}`} className="inline-flex items-center px-6 md:px-12">
              <Star size={10} className="text-charcoal/60 mr-4 fill-charcoal/60" />
              <span className="font-body text-sm font-semibold text-charcoal tracking-[0.1em] whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
