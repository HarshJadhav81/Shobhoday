import { useState, useEffect, useCallback } from 'react';
import { X, Phone } from 'lucide-react';

const messages = [
  "Free delivery on orders above \u20b9999 in Jalgaon",
  "40 Years of Trust Since 1985",
  "Same Day Delivery Available \u2014 Call Now",
  "Exclusive Wedding Sherwani Collection Available",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('announcement-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        setIsVisible(false);
        return;
      }
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('announcement-dismissed', String(Date.now()));
    }, 300);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`w-full bg-maroon text-ivory h-10 flex items-center justify-between px-4 transition-all duration-300 ${
        isDismissing ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div
          key={currentIndex}
          className="font-body text-[13px] font-medium animate-in slide-in-from-right-4 fade-in duration-500"
        >
          {messages[currentIndex]}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-ivory hover:text-gold transition-colors"
        >
          <Phone size={12} />
          <span className="font-body text-xs">+91 98765 43210</span>
        </a>
        <button
          onClick={handleDismiss}
          className="p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
