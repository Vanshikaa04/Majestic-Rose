// pages/Home.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionConfig,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  Pen,
  Gem,
  Clock,
  Quote,
} from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

// Images live in frontend/src/assets/ (this file is in src/pages/)
import img1 from '../assets/img2.jpeg';
import img2 from '../assets/img4.jpeg';
import img3 from '../assets/img3.jpeg';
import img4 from '../assets/img5.jpeg';
// Update the path below to your rose image filename (e.g., rose.png, rose.jpeg, rose.svg)
import roseImg from '../assets/rose.png';

// Replace `img1` with your actual founder image import when ready, e.g.:
// import founderImg from '../assets/founder.jpeg';
const founderImg = img1;

/* ------------------------------------------------------------------ */
/* Helpers & animation variants (frontend only)                        */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" fill="#9ca3af" font-family="sans-serif" font-size="16" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>`
  );

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ------------------------------------------------------------------ */
/* Small UI components                                                 */
/* ------------------------------------------------------------------ */

const RoseAccent = ({ className = 'w-7 h-7' }) => (
  <motion.img
    src={roseImg}
    alt="Majestic Rose"
    initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={`inline-block object-contain align-middle select-none flex-shrink-0 ${className}`}
    onError={(e) => {
      e.currentTarget.style.display = 'none';
    }}
  />
);

const SectionHeading = ({ children, light = false }) => (
  <div className="text-center mb-4">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-4xl md:text-5xl font-serif font-bold ${light ? 'text-white' : ''}`}
      style={light ? undefined : { color: LOGO_COLOR }}
    >
      {children}
    </motion.h2>
    <motion.span
      initial={{ width: 0 }}
      whileInView={{ width: 64 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className={`block h-1 rounded-full mx-auto mt-4 ${light ? 'bg-white/70' : ''}`}
      style={light ? undefined : { backgroundColor: LOGO_COLOR }}
    />
  </div>
);

// Colour used for the logo / brand text. Change it here if your logo colour
// is different from --primary-color.
const LOGO_COLOR = 'var(--primary-color)';

// Circular text badge. Pass `rotate` (a motion value) to spin on scroll,
// or leave it out to spin continuously.
const SpinBadge = ({ text, pathId, rotate, className = '', style, children }) => (
  <div className={`relative ${className}`} style={style} aria-hidden="true">
    <motion.svg
      viewBox="0 0 120 120"
      className="absolute inset-0 w-full h-full"
      style={rotate ? { rotate } : undefined}
      animate={rotate ? undefined : { rotate: 360 }}
      transition={rotate ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }}
    >
      <defs>
        <path id={pathId} d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
      </defs>
      <text fontSize="10.5" fontWeight="600" fill="currentColor">
        <textPath href={`#${pathId}`} textLength="285" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </motion.svg>
    <div className="absolute inset-0 flex items-center justify-center">{children}</div>
  </div>
);

const DotGrid = ({ color, className = '', style }) => (
  <motion.div
    aria-hidden="true"
    className={`pointer-events-none ${className}`}
    style={{
      backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
      backgroundSize: '14px 14px',
      ...style,
    }}
  />
);

const getProductImage = (p) =>
  p.media?.find((m) => m.isPrimary)?.url || p.media?.[0]?.url || PLACEHOLDER_IMAGE;

// Boutique-style product card: tall photo, name and description underneath
const CatalogCard = ({ product, className = '' }) => {
  const productImage = getProductImage(product);
  const secondImage = product.media?.find((m) => m.url && m.url !== productImage)?.url;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className={`group shrink-0 snap-center w-[70%] sm:w-[44%] md:w-auto ${className}`}
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100 shadow-md group-hover:shadow-2xl transition-shadow duration-300">
          <img
            src={productImage}
            alt={product.name || 'Product'}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              secondImage ? 'group-hover:opacity-0' : ''
            }`}
          />
          {secondImage && (
            <img
              src={secondImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
            />
          )}

          {product.media?.length > 1 && (
            <div className="absolute top-3 left-3 bg-black bg-opacity-50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
              📸 {product.media.length}
            </div>
          )}
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            ₹{product.price}
          </div>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center gap-1 bg-white text-gray-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
            View details
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="pt-4 px-1">
          <h4 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
            {product.name || 'Product'}
          </h4>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

const CATEGORY_AUTOPLAY_MS = 4500;

// Category tabs + a row of products (auto-cycles until user interacts)
const CategoryShowcase = ({ items }) => {
  const [activeName, setActiveName] = useState(items[0]?.name);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const current = items.find((c) => c.name === activeName) || items[0];

  // Ensure initial active tab syncs if items load asynchronously
  useEffect(() => {
    if (items.length > 0 && !items.some((c) => c.name === activeName)) {
      setActiveName(items[0].name);
    }
  }, [items, activeName]);

  // Auto-advance categories until user manually selects/interacts
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;

    const timer = setTimeout(() => {
      const currentIndex = items.findIndex((c) => c.name === current?.name);
      const nextIndex = (currentIndex + 1) % items.length;
      setActiveName(items[nextIndex].name);
    }, CATEGORY_AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, items, current?.name]);

  const handleManualSelect = (name) => {
    setIsAutoPlaying(false);
    setActiveName(name);
  };

  if (!current) {
    return <p className="text-center text-gray-500">New pieces are coming soon.</p>;
  }

  return (
    <div>
      {/* Category tabs */}
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto md:justify-center pb-2 mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((c) => {
          const isActive = c.name === current.name;
          return (
            <button
              key={c.name}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleManualSelect(c.name)}
              className={`relative overflow-hidden px-5 py-2 rounded-full text-sm md:text-base font-medium whitespace-nowrap border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
                isActive ? 'border-transparent text-white' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              style={isActive ? undefined : { color: LOGO_COLOR }}
            >
              {isActive && (
                <motion.span
                  layoutId="category-tab"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: LOGO_COLOR }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {/* Subtle timer progress bar inside active tab while auto-cycling */}
              {isActive && isAutoPlaying && items.length > 1 && (
                <motion.span
                  key={`progress-${c.name}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: CATEGORY_AUTOPLAY_MS / 1000, ease: 'linear' }}
                  className="absolute bottom-0 inset-x-3 h-0.5 bg-white/70 origin-left z-10 rounded-full"
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          onPointerDown={() => setIsAutoPlaying(false)}
          className="relative overflow-hidden rounded-[2rem] p-5 md:p-10 pt-8 md:pt-12 shadow-sm"
          style={{ backgroundColor: current.bgColor }}
        >
          <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${current.color}`} />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className={`text-3xl md:text-4xl font-serif font-bold ${current.textColor}`}>
                {current.label}
              </h3>
              <p className="text-gray-600 mt-2 max-w-md">{current.description}</p>
            </div>
            <Link
              to={current.link}
              onClick={() => setIsAutoPlaying(false)}
              className={`group inline-flex items-center gap-2 font-semibold self-start md:self-auto ${current.textColor}`}
            >
              <span className="border-b border-current pb-0.5">View All {current.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-5 px-5 md:mx-0 md:px-0 pb-4 md:pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {current.products.map((product, i) => (
              <CatalogCard
                key={product._id}
                product={product}
                className={i % 2 === 1 ? 'md:mt-10' : ''}
              />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="pt-20 min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-4xl text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600 mb-8">Loading amazing products...</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* What are we known for                                               */
/* ------------------------------------------------------------------ */

// Images: img1, img2, img3 (imported at the top of this file)
const knownFor = [
  {
    icon: Gem,
    title: 'Classy & Elegant',
    quote: 'Elegance is never loud. It lives in the cut, the finish and the way a piece makes you feel.',
    by: 'Majestic Rose',
    image: img1,
  },
  {
    icon: Clock,
    title: 'Timely Work',
    quote: 'Your time matters to us. Every order is planned with care so it reaches you when we promised.',
    by: 'Majestic Rose',
    image: img2,
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    quote: 'Every piece that leaves our studio is carefully crafted, inspected, and perfected.',
    by: 'Yukti Wadhwani, Founder',
    image: img3,
  },
];

const AUTOPLAY_MS = 7000;

const KnownSection = () => {
  const sectionRef = useRef(null);
  const [index, setIndex] = useState(0);
  const n = knownFor.length;

  // Scroll-linked motion for the shapes and widgets
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blobY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const dotsY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const diamondRotate = useTransform(scrollYProgress, [0, 1], [45, 315]);
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  const paginate = (dir) => setIndex((i) => (i + dir + n) % n);

  useEffect(() => {
    const timer = setTimeout(() => setIndex((i) => (i + 1) % n), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, n]);

  const slide = knownFor[index];

  return (
    <section
      ref={sectionRef}
      className="relative py-14 md:py-28 mt-5 overflow-hidden"
      style={{ backgroundColor: 'var(--secondary-color)' }}
    >
      {/* Decorative shapes that move as you scroll */}
      <motion.div
        aria-hidden="true"
        style={{ rotate: ringRotate }}
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full border border-green-600/25 pointer-events-none"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-600" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ y: blobY }}
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/50 blur-2xl pointer-events-none"
      />
      <DotGrid color="#16a34a" className="absolute top-16 right-6 md:right-16 w-28 h-28 opacity-30" style={{ y: dotsY }} />
      <motion.div
        aria-hidden="true"
        style={{ rotate: diamondRotate }}
        className="absolute left-[6%] bottom-24 w-8 h-8 border border-green-600/40 pointer-events-none"
      />
      <motion.span
        aria-hidden="true"
        style={{ y: dotsY }}
        className="absolute right-[12%] bottom-16 w-5 h-5 rounded-full bg-green-600/20 pointer-events-none"
      />

      <div className="relative container mx-auto px-4">
        <div className="mb-10 md:mb-20">
         <SectionHeading>
  <span className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 leading-tight">
    <span>Essence of Majestic Rose</span>
    <RoseAccent className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
  </span>
</SectionHeading>
           

        </div>

        {/* Separated on mobile (gap-6), overlapping on desktop (lg:gap-0 + lg:-ml-20) */}
        <div className="grid lg:grid-cols-12 items-center gap-6 lg:gap-0 max-w-6xl mx-auto">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative w-full max-w-[460px] mx-auto lg:mx-0"
          >
            <div className="hidden lg:block absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] rounded-b-[2rem] border-2 border-green-600/30" />
            <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-3xl lg:rounded-t-[999px] lg:rounded-b-[2rem] shadow-2xl bg-gradient-to-br from-pink-100 to-pink-200">
              <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-8 -bottom-8">
                <AnimatePresence>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Widgets */}
            <SpinBadge
              pathId="known-badge"
              text="Handcrafted • Elegant • Timeless • "
              rotate={badgeRotate}
              className="absolute top-3 right-3 lg:top-auto lg:-bottom-6 lg:-right-10 z-20 w-20 h-20 lg:w-32 lg:h-32 bg-white rounded-full shadow-xl text-green-700"
            >
              <Gem className="w-6 h-6" />
            </SpinBadge>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-3 left-3 lg:top-10 lg:-left-8 z-20 flex items-center gap-2 bg-white rounded-2xl shadow-lg px-3 py-2 lg:px-3.5 lg:py-2.5"
            >
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-600" />
              </span>
              <span className="text-sm font-semibold text-gray-800">Made with care</span>
            </motion.div>
          </motion.div>

          {/* Quote card (cleanly separated below image on phone, overlapping on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onPanEnd={(e, info) => {
              if (info.offset.x < -60) paginate(1);
              else if (info.offset.x > 60) paginate(-1);
            }}
            style={{ touchAction: 'pan-y' }}
            className="lg:col-span-5 relative z-10 w-full max-w-[460px] lg:max-w-none mx-auto lg:mx-0 lg:-ml-20 bg-white rounded-3xl shadow-2xl p-6 md:p-10"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-3"
                >
                  <span className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <slide.icon className="w-6 h-6 text-green-600" />
                  </span>
                  <span className="font-semibold text-gray-800">{slide.title}</span>
                </motion.div>
              </AnimatePresence>

              {/* Progress ring + counter */}
              <div className="relative w-14 h-14 text-green-600 flex-shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
                  <motion.circle
                    key={index}
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                  {index + 1}/{n}
                </span>
              </div>
            </div>

            <Quote className="hidden sm:block w-10 h-10 text-green-600/30 mb-3" />

            <div className="min-h-[9.5rem] md:min-h-[12rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <blockquote className="font-serif italic text-xl sm:text-2xl md:text-[1.7rem] leading-snug text-gray-800">
                    “{slide.quote}”
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-px w-10 bg-green-600" />
                    <p className="text-sm text-gray-500">{slide.by}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-4 pt-4 md:mt-6 md:pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {knownFor.map((item, i) => (
                  <button
                    key={item.title}
                    onClick={() => setIndex(i)}
                    aria-label={`Show ${item.title}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index ? 'w-8 bg-green-600' : 'w-2.5 bg-green-600/30 hover:bg-green-600/60'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-green-600 hover:border-green-600 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => paginate(1)}
                  aria-label="Next"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-green-600 hover:border-green-600 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const headlineWords = ['Feel', 'Rosy', 'everyday'];

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const ringY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const dotsY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white">
      {/* Decorative shapes (drift as you scroll) */}
      <motion.div
        aria-hidden="true"
        style={{ y: blobY, backgroundColor: 'var(--pink)' }}
        className="absolute -top-28 -left-28 w-80 h-80 rounded-full opacity-80 pointer-events-none"
      />
      <motion.div
        aria-hidden="true"
        style={{ y: ringY, borderColor: LOGO_COLOR }}
        className="absolute -right-24 bottom-8 w-80 h-80 rounded-full border border-dashed opacity-30 pointer-events-none"
      />
      <DotGrid
        color={LOGO_COLOR}
        className="absolute left-[44%] top-16 w-24 h-24 opacity-25 hidden lg:block"
        style={{ y: dotsY }}
      />

      <div className="relative container mx-auto px-6 md:px-10 grid lg:grid-cols-12 items-center gap-6 lg:gap-6 min-h-[calc(100vh-4rem)] py-10 lg:py-0">
        {/* Headline (order-2 on phone so it sits beneath image; order-1 on desktop) */}
        <div className="order-2 lg:order-1 lg:col-span-5 text-center lg:text-left">
          {/* Phone-only compact tagline with rose image */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:hidden inline-flex items-center justify-center gap-2 font-serif font-bold text-2xl sm:text-3xl tracking-tight"
            style={{ color: LOGO_COLOR }}
          >
            <span>Feel Rosy Everyday</span>
            <RoseAccent className="w-7 h-7 sm:w-8 sm:h-8" />
          </motion.p>

          {/* Desktop headline with rose image next to "everyday" */}
          <h1
            className="hidden lg:block font-serif font-bold leading-[1.05] text-6xl sm:text-7xl xl:text-8xl"
            style={{ color: LOGO_COLOR }}
          >
            {headlineWords.map((word, i) => (
              <span key={word} className="block overflow-hidden pb-1">
                <motion.span
                  className="inline-flex items-center gap-4"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span>{word}</span>
                  {/* {word === 'everyday' && <RoseAccent className="w-14 h-14 xl:w-16 xl:h-16" />} */}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="hidden lg:block h-1 rounded-full mt-6 mx-auto lg:mx-0"
            style={{ backgroundColor: LOGO_COLOR }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="hidden lg:block mt-6 text-gray-600 text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed"
          >
            Fashion, jewellery and scarves designed to make every day feel a little more special.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-5 lg:mt-8 flex justify-center lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToId('categories')}
              className="group inline-flex items-center gap-2 text-white font-semibold px-6 py-2.5 lg:px-7 lg:py-3 text-sm lg:text-base rounded-full shadow-xl"
              style={{ backgroundColor: LOGO_COLOR }}
            >
              <span className="lg:hidden">Shop by collection</span>
              <span className="hidden lg:inline">Shop the collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </div>

        {/* Arch image (order-1 on phone so it appears centered on top; order-2 on desktop) */}
        <div className="order-1 lg:order-2 lg:col-span-4 relative flex justify-center">
          <div className="relative w-full max-w-[260px] sm:max-w-[300px] lg:max-w-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="absolute inset-0 translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4 rounded-t-[999px] rounded-b-3xl border-2 opacity-40"
              style={{ borderColor: LOGO_COLOR }}
            />
            <motion.div
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-3xl shadow-2xl bg-gradient-to-b from-pink-100 to-pink-200"
            >
              <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-10 -bottom-10">
                <img
                  src={img4}
                  alt="Majestic Rose collection"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Phone-only minimized SpinBadge on the right of image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="lg:hidden absolute -right-6 bottom-6 z-20"
            >
              <SpinBadge
                pathId="hero-badge-mobile"
                text="Handcrafted • Elegant • Timeless • "
                className="w-16 h-16 bg-white rounded-full shadow-lg"
                style={{ color: LOGO_COLOR }}
              >
                <Sparkles className="w-4 h-4" />
              </SpinBadge>
            </motion.div>

            {/* Floating widget (desktop only) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.5 }}
              className="hidden lg:block absolute -left-8 bottom-12 z-20"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center gap-2 bg-white rounded-2xl shadow-xl px-3.5 py-2.5"
              >
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Pen className="w-4 h-4 text-green-600" />
                </span>
                <span className="text-sm font-semibold text-gray-800">Custom orders welcome</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Widgets (desktop only) */}
        <div className="hidden lg:flex lg:order-3 lg:col-span-3 lg:flex-col items-center justify-center gap-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <SpinBadge
              pathId="hero-badge"
              text="Handcrafted • Elegant • Timeless • "
              className="w-36 h-36 bg-white rounded-full shadow-lg"
              style={{ color: LOGO_COLOR }}
            >
              <Sparkles className="w-6 h-6" />
            </SpinBadge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-white rounded-2xl shadow-lg px-6 py-4 text-center border border-gray-100"
            >
              <p className="font-serif font-bold text-3xl" style={{ color: LOGO_COLOR }}>
                Since 2022
              </p>
              <p className="text-xs text-gray-500 mt-1">Crafting elegance</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => scrollToId('categories')}
        aria-label="Scroll to collections"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:block"
        style={{ color: LOGO_COLOR }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Message From Our Founder                                            */
/* ------------------------------------------------------------------ */

const FounderSection = ({ founderImage = founderImg }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Scroll-linked motion values matching Hero & KnownSection
  const imageY = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 320]);
  const blobY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const dotsY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const pillars = [
    { icon: Sparkles, label: 'Premium Quality' },
    { icon: Gem, label: 'Unique Designs' },
    { icon: Pen, label: 'Custom Orders' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: 'var(--secondary-color)' }}
    >
      {/* Ambient scroll-driven background widgets */}
      <motion.div
        aria-hidden="true"
        style={{ y: blobY, backgroundColor: 'var(--pink)' }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-70 blur-2xl pointer-events-none"
      />
      <DotGrid
        color={LOGO_COLOR}
        className="absolute bottom-14 left-6 md:left-14 w-28 h-28 opacity-25"
        style={{ y: dotsY }}
      />
      <motion.div
        aria-hidden="true"
        style={{ rotate: ringRotate, borderColor: LOGO_COLOR }}
        className="absolute top-16 left-[8%] w-10 h-10 rounded-full border border-dashed opacity-30 pointer-events-none hidden lg:block"
      />

      <div className="relative container mx-auto px-4">
        <div className="mb-12 md:mb-16">
          <SectionHeading>A Message From Our Founder</SectionHeading>
          {/* Essence of Majestic Rose + Rose Image (visible on both phone & laptop) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <span
              className="font-serif italic text-lg sm:text-xl md:text-2xl font-medium"
              style={{ color: LOGO_COLOR }}
            >
              Essence of Majestic Rose
            </span>
            <RoseAccent className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 items-center gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* LEFT: Arch Portrait + Floating Motion Widget */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative w-full max-w-[360px] lg:max-w-none mx-auto"
          >
            {/* Offset decorative arch outline */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute inset-0 -translate-x-4 translate-y-4 rounded-t-[999px] rounded-b-[2rem] border-2 opacity-40"
              style={{ borderColor: LOGO_COLOR }}
            />

            {/* Main arch photo container */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-2xl bg-gradient-to-b from-pink-100 to-pink-200">
              {/* Fallback monogram if photo isn't loaded yet */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-serif font-bold text-6xl opacity-30"
                  style={{ color: LOGO_COLOR }}
                >
                  YW
                </span>
              </div>

              <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-8 -bottom-8">
                <img
                  src={founderImage}
                  alt="Yukti Wadhwani, Founder of Majestic Rose"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </motion.div>

              {/* Subtle bottom gradient nameplate inside photo */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent p-6 pt-14 text-white">
                <p className="font-serif font-bold text-2xl leading-tight">Yukti Wadhwani</p>
                <p className="text-xs tracking-wider uppercase text-white/85 mt-0.5">
                  Founder & Creative Director
                </p>
              </div>
            </div>

            {/* Floating "Est. 2022" pill */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 -left-3 sm:-left-6 z-20 flex items-center gap-2.5 bg-white rounded-2xl shadow-xl px-4 py-2.5 border border-pink-100"
            >
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-600" />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-none">Est. 2022</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Majestic Rose</p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Non-overlapping Editorial Letter Card */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative bg-white rounded-[2rem] shadow-2xl p-6 sm:p-10 lg:p-12 border border-pink-50"
          >
            {/* Top label with rose image + watermark quote icon */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3.5 py-1.5 rounded-full"
                style={{ backgroundColor: 'var(--pink)', color: LOGO_COLOR }}
              >
                <span>Essence of Majestic Rose</span>
            {/* <RoseAccent className="w-7 h-7 sm:w-8 sm:h-8" /> */}

                <RoseAccent className="w-4 h-4" />
              </span>
              <Quote className="w-10 h-10 opacity-15 flex-shrink-0" style={{ color: LOGO_COLOR }} />
            </div>

            {/* Staggered Founder Letter */}
            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-4 text-gray-700"
            >
              <motion.p
                variants={itemVariants}
                className="font-serif italic text-xl md:text-2xl leading-snug text-gray-900"
              >
                “I started Majestic Rose in 2022 with an ambitious mindset and a vision to create
                something truly special.”
              </motion.p>

              <motion.p variants={itemVariants} className="text-sm md:text-base leading-relaxed">
                My goal is simple – to provide premium quality, unique designs that you won't find
                anywhere else, with customization available to make every piece truly yours. When I
                say premium quality, I mean it. Every piece that leaves our studio is carefully
                crafted, inspected, and perfected.
              </motion.p>

              <motion.p variants={itemVariants} className="text-sm md:text-base leading-relaxed">
                What makes us different? It's the personal touch. Whether you're looking for
                something from our collection or want a custom piece designed just for you, we're
                here to bring your vision to life. Because at Majestic Rose, you're not just a
                customer – you're part of our story.
              </motion.p>

              <motion.p variants={itemVariants} className="text-sm md:text-base leading-relaxed">
                To every woman who has trusted us, shopped with us, and believed in our dream –
                thank you. You are the reason we wake up every morning with passion and purpose.
              </motion.p>
            </motion.div>

            {/* Signature block */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
            >
              {/* Interactive Pillar Pills */}
              <div className="flex flex-wrap gap-2">
                {pillars.map(({ icon: Icon, label }) => (
                  <motion.span
                    key={label}
                    whileHover={{ y: -3, scale: 1.03 }}
                    className="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-default"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </motion.span>
                ))}
              </div>

              {/* Signature */}
              <div className="sm:text-right flex-shrink-0">
                <p
                  className="text-2xl md:text-3xl font-serif italic font-bold"
                  style={{ color: LOGO_COLOR }}
                >
                  Yukti Wadhwani
                </p>
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="block h-0.5 rounded-full mt-1"
                  style={{ backgroundColor: LOGO_COLOR }}
                />
                <p className="text-xs text-gray-500 mt-1">Founder, Majestic Rose</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Home = () => {
  const { products, loading } = useContext(ProductContext);

  // UI-only state
  const [showTop, setShowTop] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });
  useMotionValueEvent(scrollY, 'change', (v) => setShowTop(v > 600));

  const categories = [
    {
      name: 'fashion',
      label: 'Fashion',
      description: 'Elegant clothing for every occasion',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'var(--pink)',
      textColor: 'text-pink-600',
      borderColor: 'border-pink-200',
      link: '/products/fashion', // Direct to products page
    },

    {
      name: 'earrings',
      label: 'Earrings',
      description: 'Stunning earrings to enhance your beauty',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'var(--secondary-color)',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      link: '/products/jewellery', // Goes to jewellery page with filter handled in Products component
    },
    {
      name: 'necklace',
      label: 'Neck Pieces',
      description: 'Beautiful neckpieces for every occasion',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'var(--pink)',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      link: '/products/jewellery', // Goes to jewellery page with filter handled in Products component
    },

    {
      name: 'rings',
      label: 'Rings',
      description: 'Exquisite rings to complete your look',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'var(--secondary-color)',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      link: '/products/jewellery', // Goes to jewellery page with filter handled in Products component
    },
    {
      name: 'stoles-scarves',
      label: 'Stoles & Scarves',
      description: 'Explore our unique stoles & scarves collections',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'var(--pink)',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      link: '/products/stoles-scarves', // Direct to products page
    },
  ];

  // Get products for each category (max 4)
  const getCategoryProducts = (categoryName) => {
    if (categoryName === 'rings' || categoryName === 'necklace' || categoryName === 'earrings') {
      // For jewellery subcategories, filter by subcategory
      return products
        .filter((p) => p.category === 'jewellery' && p.subcategory === categoryName)
        .slice(0, 4);
    } else {
      // For fashion and stoles-scarves
      return products.filter((p) => p.category === categoryName).slice(0, 4);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const showcaseItems = categories
    .map((c) => ({ ...c, products: getCategoryProducts(c.name) }))
    .filter((c) => c.products.length > 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="pt-16">
        {/* Scroll progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-green-600 origin-left z-[60]"
          style={{ scaleX: progress }}
        />

        {/* Hero Section */}
        <Hero />

        {/* What are we known for */}
        <KnownSection />

        {/* Shop by category */}
        <section id="categories" className="bg-white scroll-mt-16">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <SectionHeading>Shop by Category</SectionHeading>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-center mb-10 max-w-2xl mx-auto"
            >
              Explore our carefully curated collections, each piece selected for its unique style
              and quality
            </motion.p>
            <CategoryShowcase items={showcaseItems} />
          </div>
        </section>

        {/* Founder's Detailed Message Section */}
        <FounderSection founderImage={founderImg} />

        {/* Back to top */}
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="fixed bottom-6 left-6 z-40 bg-green-600 text-white p-3 rounded-full shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

export default Home;