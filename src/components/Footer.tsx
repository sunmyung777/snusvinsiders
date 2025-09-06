import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const footerLinks = {
    about: ['행사소개', '공지사항', '참가신청'],
    program: ['연사 강연', 'IR 피칭', '네트워킹'],
    partners: ['주최기관', '협력학회', '후원사'],
    contact: ['문의하기', '오시는길', '행사장안내']
  };

  const relatedSites = [
    'SNU Insiders',
    'SNUSV',
    'SNU 창업지원단'
  ];

  const hosts = [
    'SNU Insiders',
    'SNUSV'
  ];

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="footer-logo">YTFF 2025</h3>
            <p className="footer-tagline">
              「Young Tech Founders Forum 2025」
            </p>
            <p className="footer-description">
              딥테크 분야 창업가들과 연구자들이 만나는<br />
              특별한 네트워킹 행사에서 새로운 기회를 발견하세요.
            </p>

            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={18} />
                <span>ytff2025@gmail.com</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>02-3475-2618</span>
              </div>
            </div>

            <div className="footer-social">
              <button className="social-icon" aria-label="YouTube">
                <Youtube size={20} />
              </button>
              <button className="social-icon" aria-label="Facebook">
                <Facebook size={20} />
              </button>
              <button className="social-icon" aria-label="Instagram">
                <Instagram size={20} />
              </button>
              <button className="social-icon" aria-label="LinkedIn">
                <Linkedin size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="footer-section">
              <h4>About</h4>
              <ul>
                {footerLinks.about.map((link) => (
                  <li key={link}>
                    <button>{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Program</h4>
              <ul>
                {footerLinks.program.map((link) => (
                  <li key={link}>
                    <button>{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Partners</h4>
              <ul>
                {footerLinks.partners.map((link) => (
                  <li key={link}>
                    <button>{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                {footerLinks.contact.map((link) => (
                  <li key={link}>
                    <button>{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="footer-info"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="footer-section">
              <h4>Related Sites</h4>
              <ul>
                {relatedSites.map((site) => (
                  <li key={site}>
                    <button>{site}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Hosted by</h4>
              <ul>
                {hosts.map((host) => (
                  <li key={host}>
                    <button>{host}</button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <p>&copy; Young Tech Founders Forum 2025. All rights reserved.</p>
              <div className="legal-links">
                <button>Terms of Service</button>
                <button>Privacy & Copyright Policy</button>
              </div>
            </div>
            <div className="footer-office">
              <p>Young Tech Founders Forum 2025 사무국</p>
              <p>All contents provided by YTFF 2025 are copyrighted works protected by copyright law.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
