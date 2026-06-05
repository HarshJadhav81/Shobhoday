import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal<T extends HTMLElement>(
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    start?: string;
    childSelector?: string;
  }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 60,
      duration = 0.7,
      stagger = 0.1,
      delay = 0,
      start = 'top 80%',
      childSelector,
    } = options || {};

    const targets = childSelector
      ? el.querySelectorAll(childSelector)
      : el;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        stagger,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
