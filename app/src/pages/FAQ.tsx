import { useState, useEffect } from 'react';
import { SEOMeta } from '../components/SEOMeta';
import { SectionHeader } from '../components/SectionHeader';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does custom tailoring take?',
        a: 'For our custom-tailored sherwanis and suits, we require approximately 15-20 business days to ensure meticulous craftsmanship and perfect fitting. Rush orders may be accommodated upon request.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we offer worldwide shipping. International delivery times vary between 7-14 business days depending on the destination. Customs duties may apply and are the responsibility of the customer.'
      },
      {
        q: 'Can I track my order?',
        a: 'Absolutely. Once your order is dispatched from our Jalgaon studio, you will receive an email with a tracking number and a link to monitor your shipment.'
      }
    ]
  },
  {
    title: 'Fittings & Alterations',
    questions: [
      {
        q: 'Do you offer virtual fitting consultations?',
        a: 'Yes, we provide personalized video consultations where our expert tailors guide you through taking accurate measurements from the comfort of your home.'
      },
      {
        q: 'What if my garment needs alterations upon arrival?',
        a: 'We leave a margin of up to 2 inches in all custom garments for local alterations. If major adjustments are needed due to a measurement error on our part, we will cover the alteration costs.'
      }
    ]
  },
  {
    title: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'Ready-to-wear items can be returned within 14 days of delivery, provided they are unworn and have original tags. Custom-tailored garments are final sale and cannot be returned, as they are crafted specifically to your measurements.'
      },
      {
        q: 'How do I initiate an exchange?',
        a: 'Please contact our support team via email or WhatsApp within 48 hours of receiving your order to initiate an exchange for ready-to-wear items.'
      }
    ]
  }
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.animate-fade-up', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="bg-beige min-h-screen pt-24 md:pt-32 pb-20">
      <SEOMeta title="FAQ | Navjeevan Creation" />
      
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <SectionHeader title="Frequently Asked Questions" subtitle="Here to help" />
          <p className="font-body text-slate mt-4">
            Find answers to common questions about our tailoring process, shipping, and more.
          </p>
        </div>

        <div className="space-y-12">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="animate-fade-up">
              <h2 className="font-display text-2xl text-charcoal mb-6 border-b border-slate/20 pb-2">
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const globalIndex = catIndex * 100 + qIndex; // unique id
                  const isOpen = openQuestion === globalIndex;
                  return (
                    <div 
                      key={globalIndex} 
                      className="border border-charcoal/10 bg-white rounded-lg overflow-hidden transition-shadow hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between font-body text-charcoal font-medium"
                      >
                        {faq.q}
                        <ChevronDown 
                          size={20} 
                          className={`text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <div 
                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="font-body text-slate text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center p-8 bg-charcoal text-ivory rounded-2xl animate-fade-up">
          <h3 className="font-display text-2xl mb-3">Still have questions?</h3>
          <p className="font-body text-ivory/80 mb-6">Our master tailors and support team are available to assist you.</p>
          <a href="/contact" className="inline-block bg-gold text-charcoal px-8 py-3 uppercase tracking-widest font-medium text-sm hover:bg-white transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
