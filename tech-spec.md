# Tech Spec — Navjeevan Creation

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.0 | UI framework |
| react-dom | ^18.3.0 | React DOM renderer |
| vite | ^5.0.0 | Build tool (via webapp-building init) |
| typescript | ^5.4.0 | Type safety |
| tailwindcss | ^3.4.0 | Utility CSS |
| gsap | ^3.12.0 | Core animation engine — timelines, tweens, ScrollTrigger |
| framer-motion | ^11.0.0 | Declarative React animations — page transitions, mobile menu, modal |
| lucide-react | ^0.383.0 | Icon library (search, heart, user, shopping-bag, menu, x, chevron-down, star, instagram, facebook, youtube, map-pin, phone, whatsapp, arrow-up, arrow-right) |
| @studio-freight/lenis | ^1.0.0 | Smooth scroll with inertia |

No shadcn/ui components needed — the design is fully bespoke with custom styling. All components are hand-built.

## Component Inventory

### Layout (shared across all pages)

| Component | Source | Notes |
|-----------|--------|-------|
| AnnouncementBar | Custom | Auto-rotating ticker, dismissible, cookie-persisted |
| Navbar | Custom | Sticky with transparent→white scroll transition, mega menu, mobile hamburger |
| MobileMenu | Custom | Full-screen overlay with staggered link animations (Framer Motion) |
| MegaMenu | Custom | 5-column dropdown on Collections hover |
| Footer | Custom | 4-column link grid, social icons, back-to-top button |
| CustomCursor | Custom | Desktop only, lerp-smoothed position, hover state detection |
| PageLoader | Custom | Brand logo overlay with GSAP timeline exit sequence |
| LenisProvider | Custom | Wraps Lenis init + GSAP ScrollTrigger integration |

### Sections (Home page only — single-page design)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroCarousel | Custom | 3D perspective scroll-driven carousel — core effect |
| BrandTicker | Custom | CSS infinite marquee on gold background |
| CategoryGrid | Custom | 6-card asymmetric masonry grid with hover reveals |
| FeaturedProducts | Custom | Filter tabs + 4-column product grid |
| BrandStory | Custom | Two-column with parallax image + trust stats |
| Lookbook | Custom | 3-column editorial grid with hover overlay modal |
| Testimonials | Custom | Auto-rotating carousel with drag support |
| InstagramFeed | Custom | 6-image grid with hover overlay |
| Newsletter | Custom | Maroon section with email form |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| ProductCard | Custom | FeaturedProducts grid |
| CategoryCard | Custom | CategoryGrid |
| LookbookCard | Custom | Lookbook grid |
| TestimonialCard | Custom | Testimonials carousel |
| SectionTitle | Custom | Multiple sections (eyebrow + H2 pattern) |
| ScrollReveal | Custom | Wrapper for GSAP ScrollTrigger entrance animations |

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| 3D Perspective Carousel (hero) | GSAP + ScrollTrigger | ScrollTrigger-pinned timeline with rotationY/rotationX/rotationZ on carousel-inner, individual scale/brightness per card based on front/back half detection, yPercent parallax on inner images | 🔒 High |
| Page Loader Sequence | GSAP | Master timeline: overlay fade-in → logo display → logo fade → overlay slide-up → navbar fade → hero text stagger | Medium |
| Navbar scroll transition | GSAP ScrollTrigger | ScrollTrigger at 100px toggles class/inline styles for bg/color/shadow | Low |
| Custom cursor | Vanilla JS + rAF | rAF loop with lerp smoothing, CSS custom properties for position, class toggle on hover targets | Medium |
| Marquee (brand ticker) | CSS | @keyframes translateX(0) → translateX(-50%), duplicated content, CSS animation | Low |
| Smooth scroll | Lenis | Lenis instance connected to GSAP ticker via raf callback | Low |
| Section entrance reveals | GSAP ScrollTrigger | Reusable ScrollReveal component: gsap.from with translateY + opacity, stagger children | Medium |
| Hero text entrance | GSAP | Part of page loader master timeline — staggered fade-up on eyebrow/H1/subtitle/CTAs | Medium |
| Category card hover | CSS | transform scale on image, translateY on "Shop Now" text, border reveal | Low |
| Product card hover | CSS | Image crossfade (opacity transition), quick-add slide-up, wishlist appear | Low |
| Filter tab underline | CSS | Pseudo-element scaleX transition, transform-origin shift | Low |
| Mobile menu | Framer Motion | AnimatePresence with slide-in, staggered link children | Medium |
| Testimonial carousel | Framer Motion + setInterval | AnimatePresence for slide transitions, auto-advance timer, drag gesture | Medium |
| Lookbook modal | Framer Motion | AnimatePresence fade/scale overlay with product list | Medium |
| Announcement ticker | CSS + JS | setInterval for text rotation with slide transitions | Low |
| Parallax (brand story) | GSAP ScrollTrigger | ScrollTrigger scrub on image translateY | Low |
| Button/link hovers | CSS | Transitions on background, transform, pseudo-elements | Low |

## State & Logic

### Custom Cursor — Imperative rAF Loop

The cursor runs entirely outside React's render cycle for 60fps performance. A single `useEffect` sets up a `requestAnimationFrame` loop that reads mouse position from a ref and applies lerp-smoothed values directly to DOM elements via `transform`. Hover detection uses event delegation on `mouseenter`/`mouseleave` for interactive elements. Cursor state (hover/click) is tracked in refs, not React state.

### Lenis ↔ ScrollTrigger Sync

Lenis must be initialized once at app root and connected to GSAP's ticker. The integration is boilerplate: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((time) => lenis.raf(time * 1000))`. This is critical — without it, ScrollTrigger-driven animations (carousel, section reveals) will desync from Lenis-smoothed scroll position.

### Carousel Card Visibility Culling

For performance, cards on the back half of the carousel rotation (roughly >90deg from the viewer's front-facing position) should be hidden. This requires computing each card's effective rotation based on the container's current `rotationY` + the card's static `rotateY` offset. A lightweight check in the ScrollTrigger `onUpdate` callback can toggle `visibility` on back-facing cards.

### Page Loader — GSAP Master Timeline

The loader coordinates 5+ sequential animations. Use a single GSAP timeline with absolute position offsets (not delays) for precise sequencing. The timeline must resolve before ScrollTrigger initializes, otherwise pinned sections may calculate wrong start positions. Approach: create timeline, add completion callback that calls `ScrollTrigger.refresh()`, then start timeline.

### Testimonials — Auto-Advance with Pause on Interaction

The carousel uses a `useRef` for the current index and `setInterval` for auto-advance. The interval must be cleared on: manual dot click, drag gesture, and component unmount. Restart the timer after 8s of inactivity following a manual interaction.

## Other Key Decisions

### Single-Page Architecture

The design spec describes a single homepage with all sections. No multi-page routing is needed. Internal links (Collections, About, Contact) can scroll to corresponding sections or show placeholder modals.

### No shadcn/ui

The design is entirely bespoke with zero standard UI patterns (no forms, dialogs, tables, or data entry). Every element has custom styling specific to the brand. Adding shadcn would introduce unused overhead.

### Image Strategy

Product/category images are AI-generated and stored in `public/images/`. The carousel reuses the same ~8 hero images across 20 card slots (looping). No external CDN or dynamic image loading — all assets are bundled at build time.

### Mobile Navigation — Bottom Bar

Per the master prompt, a bottom mobile nav bar (Home, Search, Wishlist, Cart, Account) should be added as a fixed element below 768px viewport. This is in addition to the hamburger menu which opens the full-screen nav overlay.
