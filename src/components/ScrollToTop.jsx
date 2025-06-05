import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // show after user scrolls down 300px
      setVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="
        fixed bottom-8 right-8
        w-12 h-12
        bg-blue-600 text-white
        rounded-full shadow-lg
        flex items-center justify-center
        hover:bg-blue-700 transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-300
        z-50
      "
    >
      <FaArrowUp />
    </button>
  );
}
