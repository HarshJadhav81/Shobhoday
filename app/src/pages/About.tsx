import { useEffect } from 'react';
import { SEOMeta } from '../components/SEOMeta';
import { SectionHeader } from '../components/SectionHeader';
import gsap from 'gsap';

export default function About() {
  useEffect(() => {
    // Entrance animations
    const ctx = gsap.context(() => {
      gsap.fromTo('.animate-fade-up', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-beige min-h-screen pt-24 md:pt-32 pb-20">
      <SEOMeta 
        title="Our Heritage | Navjeevan Creation" 
        description="Discover the legacy of Navjeevan Creation, crafting premium men's ethnic and formal wear since 1985 in Jalgaon, Maharashtra."
      />

      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-16 md:mb-24 animate-fade-up">
          <SectionHeader title="Our Heritage" subtitle="Est. 1985 &mdash; Jalgaon" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Image */}
          <div className="relative animate-fade-up">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl relative z-10">
              <img 
                src="/images/hero-carousel-3.jpg" 
                alt="Navjeevan Creation Tailoring Heritage" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-8 -right-8 w-full h-full border border-gold/40 rounded-[2rem] z-0 hidden md:block"></div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8 animate-fade-up">
            <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight">
              Four Decades of <br/>
              <span className="text-gold italic">Sartorial Excellence</span>
            </h2>
            
            <div className="space-y-6 font-body text-slate text-lg leading-relaxed">
              <p>
                Founded in 1985 in the heart of Jalgaon, Maharashtra, Navjeevan Creation began with a singular vision: to redefine men's fashion by seamlessly blending deep-rooted Indian traditions with contemporary elegance.
              </p>
              <p>
                What started as a boutique tailoring studio has blossomed into the region's premier destination for luxury menswear. From meticulously embroidered Sherwanis to impeccably tailored Tuxedos, every garment we create is a testament to our commitment to craftsmanship.
              </p>
              <p>
                We believe that clothing is more than just fabric—it is an expression of identity, heritage, and pride. Our master artisans dedicate hundreds of hours to intricate hand-embroidery, ensuring that when you wear Navjeevan Creation, you wear a masterpiece.
              </p>
            </div>

            <div className="pt-8 border-t border-slate/20">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="font-display text-4xl text-charcoal mb-2">38+</div>
                  <div className="font-body text-xs text-slate uppercase tracking-widest">Years of Trust</div>
                </div>
                <div>
                  <div className="font-display text-4xl text-charcoal mb-2">10k+</div>
                  <div className="font-body text-xs text-slate uppercase tracking-widest">Happy Grooms</div>
                </div>
                <div>
                  <div className="font-display text-4xl text-charcoal mb-2">100%</div>
                  <div className="font-body text-xs text-slate uppercase tracking-widest">Handcrafted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full width image banner */}
        <div className="mt-32 relative h-[60vh] rounded-[2rem] overflow-hidden shadow-2xl animate-fade-up">
          <img src="/images/hero-carousel-2.jpg" alt="Craftsmanship" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
            <h3 className="font-display text-5xl md:text-7xl text-ivory text-center px-4 leading-tight">
              Wear the Legacy.<br/>
              <span className="italic text-gold text-4xl md:text-5xl">Own the Moment.</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
