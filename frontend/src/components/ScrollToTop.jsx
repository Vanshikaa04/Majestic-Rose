// components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
  // Small delay to ensure DOM is ready
  const timeout = setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
  return () => clearTimeout(timeout);
}, [pathname]);

  return null;
};

export default ScrollToTop;