import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Calendar, Clock } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const hosts = [
    { name: 'INSIDERS', url: 'https://insiders.co.kr' },
    { name: 'SNUSV', url: 'https://snusv.net' }
  ];

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Registration', href: '#registration' }
  ];

  return (
    <footer className="footer">
      <div className="container">
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
              Young Tech Founders Forum 2025
            </p>
            <p className="footer-description">
              딥테크 분야 학생 창업가들의 네트워킹 포럼
            </p>

            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <a href="mailto:insiders@insiders.co.kr">insiders@insiders.co.kr</a>
                <Mail size={16} />
                <a href="mailto:president@snusv.net">president@snusv.net</a>
              </div>
              <div className="contact-item">
                <Calendar size={16} />
                <span>2025년 11월 03일 (월)</span>
              </div>
              <div className="contact-item">
                <Clock size={16} />
                <span>19:00 - 22:00</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>네이버 D2SF 센터<br/>강남역 2번 출구 앞 메리츠 빌딩 16층</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="footer-links-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="footer-section">
              <h4>QUICK LINKS</h4>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href}>{link.name}</a>
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
              <h4>HOSTED BY</h4>
              <ul>
                {hosts.map((host) => (
                  <li key={host.name}>
                    <a href={host.url} target="_blank" rel="noopener noreferrer">
                      {host.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 Young Tech Founders Forum. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
