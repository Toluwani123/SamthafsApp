import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import {Link, useNavigate, useLocation} from 'react-router-dom';

function Footer({ setActivePage, setIsContactModalOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = ['home','projects','services','about'];
  const socialIcons = [
    { Icon: FaFacebook, href: 'https://facebook.com/yourpage' },
    { Icon: FaTwitter, href: 'https://twitter.com/yourpage' },
    { Icon: FaLinkedinIn, href: 'https://linkedin.com/in/yourprofile' },
    { Icon: FaInstagram, href: 'https://instagram.com/yourpage' },
  ]

  const handleNav = (e,link) => {
    e.preventDefault();
    setActivePage(link);
    if (link === 'home' || link === 'projects') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(link)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

      } else {
        document.getElementById(link)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/${link}`);
    }
  }
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* column 1 */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Samthafs</h3>
            <p className="text-gray-400 mb-6">
              Excellence in construction with precision, innovation, and integrity since 2005.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* column 2 – quick links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link}>
                  <a
                    href={ link==='services'||link==='about' ? `/${link}` : `#${link}` }
                    onClick={e => handleNav(e, link)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link[0].toUpperCase() + link.slice(1)}

                  </a>
                </li>

              ))}
              <li>
                <a
                  href="#contact"
                  onClick={e => {
                    e.preventDefault();
                    setIsContactModalOpen(true);
                  }}
                  className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                  </a>
              </li>
            </ul>

            
          </div>

          {/* column 3 – contact info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3" />
                <span>
                  23b Jaiye Oyedotun Street
                  <br />
                  Lagos, NG
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3" />
                <span>(+234) 803-703-9664</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3" />
                <span>samthafs@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* column 4 – newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Login (Site Admin)</h4>
            
            <div className="flex">
              
              <button className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r text-sm font-medium"
                onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
          </div>
          
        </div>

        {/* copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Samthafs Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
