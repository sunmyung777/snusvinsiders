import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Globe, Search } from 'lucide-react';
import RegistrationCheckModal from './RegistrationCheckModal';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'About', href: '#about', submenu: ['행사소개', '공지사항', '아카이브'] },
    { name: 'Exhibition', href: '#exhibition', submenu: ['행사장안내도', '참여기업'] },
    { name: 'Conference', href: '#conference', submenu: ['타임라인', '연사'] },
    { name: 'Events', href: '#events', submenu: ['파트너 학회', '피칭'] },
    { name: 'Registration', href: '#registration', submenu: null },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <motion.div
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="/" className="logo-link"><h1>YTFF 2025</h1></a>
          </motion.div>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            {menuItems.map((item, index) => (
              <div key={item.name} className="menu-item">
                <button
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className="menu-link"
                >
                  {item.name}
                </button>
                {item.submenu && (
                  <div className="submenu">
                    {item.submenu.map((subItem) => (
                      <button key={subItem} className="submenu-link">
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            <button className="lang-toggle">
              <Globe size={20} />
              <span>KOR</span>
            </button>
            <button
              className="check-btn btn-secondary"
              onClick={() => setIsCheckModalOpen(true)}
            >
              <Search size={18} />
              신청 확인
            </button>
            <button
              className="register-btn btn-primary"
              onClick={() => scrollToSection('registration')}
            >
              참가신청
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuItems.map((item) => (
              <div key={item.name} className="mobile-menu-item">
                <button
                  onClick={() => scrollToSection(item.href.substring(1))}
                  className="mobile-menu-link"
                >
                  {item.name}
                </button>
                {item.submenu && (
                  <div className="mobile-submenu">
                    {item.submenu.map((subItem) => (
                      <button key={subItem} className="mobile-submenu-link">
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mobile-menu-actions">
              <button className="mobile-lang-btn">KOR/ENG</button>
              <button
                className="mobile-check-btn btn-secondary"
                onClick={() => {
                  setIsCheckModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <Search size={18} />
                신청 확인
              </button>
              <button
                className="mobile-register-btn btn-primary"
                onClick={() => scrollToSection('registration')}
              >
                참가신청
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 신청 확인 모달 */}
      <RegistrationCheckModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
      />
    </motion.nav>
  );
};

export default Navbar;
