import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const ringCurrentRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const isClickingRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only enable on devices with fine pointer
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    document.body.classList.add('custom-cursor-enabled');

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseEnterInteractive = () => {
      isHoveringRef.current = true;
    };

    const onMouseLeaveInteractive = () => {
      isHoveringRef.current = false;
    };

    const onMouseDown = () => {
      isClickingRef.current = true;
    };

    const onMouseUp = () => {
      isClickingRef.current = false;
    };

    const animate = () => {
      const lerp = 1;
      const ringLerp = 1;

      currentRef.current.x += (mouseRef.current.x - currentRef.current.x) * lerp;
      currentRef.current.y += (mouseRef.current.y - currentRef.current.y) * lerp;

      ringCurrentRef.current.x += (mouseRef.current.x - ringCurrentRef.current.x) * ringLerp;
      ringCurrentRef.current.y += (mouseRef.current.y - ringCurrentRef.current.y) * ringLerp;

      if (dotRef.current) {
        const dotScale = isHoveringRef.current ? 1.5 : 1;
        const clickScale = isClickingRef.current ? 0.9 : 1;
        const finalScale = dotScale * clickScale;
        dotRef.current.style.transform = `translate3d(${currentRef.current.x - 4}px, ${currentRef.current.y - 4}px, 0) scale(${finalScale})`;
      }

      if (ringRef.current) {
        const ringScale = isHoveringRef.current ? 1.4 : 1;
        const ringOpacity = isHoveringRef.current ? 0.8 : 0.4;
        ringRef.current.style.transform = `translate3d(${ringCurrentRef.current.x - 20}px, ${ringCurrentRef.current.y - 20}px, 0) scale(${ringScale})`;
        ringRef.current.style.opacity = String(ringOpacity);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Event delegation for interactive elements
    const addInteractiveListeners = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
      return interactives;
    };

    // Initial setup + mutation observer for dynamic content
    let interactives = addInteractiveListeners();

    const observer = new MutationObserver(() => {
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
      interactives = addInteractiveListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive);
        el.removeEventListener('mouseleave', onMouseLeaveInteractive);
      });
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#C9A84C',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid #C9A84C',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0.4,
          willChange: 'transform',
        }}
      />
    </>
  );
}
