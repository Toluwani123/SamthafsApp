// src/components/MenuBar.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function MenuBar({
  isScrolled,
  activePage,
  setActivePage,
  setIsQuoteModalOpen,
  setIsContactModalOpen,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // close mobile menu if you scroll or switch pages
  useEffect(() => {
    if (mobileOpen) {
      const handleScroll = () => setMobileOpen(false);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [mobileOpen]);

  const links = ['home', 'projects', 'services', 'about'];

  const handleSectionClick = (e, section) => {
    e.preventDefault();
    setActivePage(section);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`
        fixed w-full z-50 transition-all duration-300
        ${isScrolled ? 'bg-white shadow-md text-gray-800' : 'bg-transparent text-white'}
      `}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* brand */}
        <h1 className="text-2xl font-bold">Samthafs</h1>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map(link => {
            const label = link[0].toUpperCase() + link.slice(1);
            if (link === 'home' || link === 'projects') {
              return (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={e => handleSectionClick(e, link)}
                  className={`font-medium transition-colors hover:text-blue-500 cursor-pointer ${
                    activePage === link ? 'text-blue-500' : ''
                  }`}
                >
                  {label}
                </a>
              );
            }

            return (
              <Link
                key={link}
                to={`/${link}`}
                onClick={() => setActivePage(link)}
                className={`font-medium transition-colors hover:text-blue-500 ${
                  activePage === link ? 'text-blue-500' : ''
                }`}
              >
                {label}
              </Link>
            );
          })}

          <a
            href="#contact"
            onClick={() => setIsContactModalOpen(true)}
            className="font-medium transition-colors hover:text-blue-500 cursor-pointer"
          >
            Contact
          </a>

          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className={`rounded-button whitespace-nowrap px-6 py-2 font-medium transition-colors ${
              isScrolled ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
            }`}
          >
            Get a Quote
          </button>
        </nav>

        {/* mobile toggle */}
        <button
          onClick={() => setMobileOpen(open => !open)}
          className="md:hidden text-2xl focus:outline-none"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white text-gray-800 shadow-md">
          <div className="flex flex-col items-center space-y-4 py-6">
            {links.map(link => {
              const label = link[0].toUpperCase() + link.slice(1);
              if (link === 'home' || link === 'projects') {
                return (
                  <a
                    key={link}
                    href={`#${link}`}
                    onClick={e => {
                      handleSectionClick(e, link);
                      setMobileOpen(false);
                    }}
                    className={`text-lg font-medium transition-colors hover:text-blue-500 ${
                      activePage === link ? 'text-blue-500' : ''
                    }`}
                  >
                    {label}
                  </a>
                );
              }

              return (
                <Link
                  key={link}
                  to={`/${link}`}
                  onClick={() => {
                    setActivePage(link);
                    setMobileOpen(false);
                  }}
                  className={`text-lg font-medium transition-colors hover:text-blue-500 ${
                    activePage === link ? 'text-blue-500' : ''
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setIsContactModalOpen(true);
                setMobileOpen(false);
              }}
              className="text-lg font-medium transition-colors hover:text-blue-500"
            >
              Contact
            </button>

            <button
              onClick={() => {
                setIsQuoteModalOpen(true);
                setMobileOpen(false);
              }}
              className="rounded-button px-6 py-2 text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Get a Quote
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
