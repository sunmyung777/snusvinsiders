import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import RegistrationCheckModal from './RegistrationCheckModal';
import { useAuth } from '../contexts/AuthContext';
import { getTotalUnreadCount } from '../lib/supabase';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, profile } = useAuth();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    if (!profile) return;

    try {
      const count = await getTotalUnreadCount(profile.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('안 읽은 메시지 수 로드 오류:', error);
    }
  }, [profile]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (profile) {
      loadUnreadCount();

      // 주기적으로 안 읽은 메시지 수 업데이트 (10초마다)
      const interval = setInterval(loadUnreadCount, 10000);

      // storage 이벤트 리스너 (다른 탭에서 메시지가 왔을 때)
      const handleStorageChange = () => {
        loadUnreadCount();
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('new-message', handleStorageChange);
      window.addEventListener('messages-read', handleStorageChange);

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('new-message', handleStorageChange);
        window.removeEventListener('messages-read', handleStorageChange);
      };
    }
  }, [profile, loadUnreadCount]);

  const menuItems = [
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Registration', href: '#registration' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      alert('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

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
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.substring(1))}
                className="menu-link"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                <Link
                  to="/explorer"
                  className="nav-action-btn"
                >
                   참가자
                </Link>
                <Link
                  to="/profile"
                  className="nav-action-btn"
                >
                   프로필
                </Link>
                <Link
                  to="/chat"
                  className="nav-action-btn message-link"
                >
                   메시지
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                  )}
                </Link>
                <button
                  className="logout-btn btn-secondary"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="login-btn btn-primary"
              >
                로그인
              </Link>
            )}
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
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.substring(1))}
                className="mobile-menu-link"
              >
                {item.name}
              </button>
            ))}
            <div className="mobile-menu-actions">
              {user ? (
                <>
                  <Link
                    to="/explorer"
                    className="mobile-action-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    참가자 탐색
                  </Link>
                  <Link
                    to="/profile"
                    className="mobile-action-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                     내 프로필
                  </Link>
                  <Link
                    to="/chat"
                    className="mobile-action-btn message-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                     메시지
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </Link>
                  <button
                    className="mobile-logout-btn btn-secondary"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="mobile-login-btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
              )}
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
