import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, QrCode, Calendar, MapPin } from 'lucide-react';
import './Hero.css';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ gridColumn: '1 / -1', textAlign: 'center', maxWidth: 'none' }}
          >
            <div className="hero-badge">
              <span>Young Tech Founders Forum 2025</span>
            </div>

            <h1 className="hero-title">
              <span className="highlight">Young Tech</span>{' '}
              <span className="highlight">Founders Forum</span>
            </h1>

            <p className="hero-subtitle">
              국내 최고의 딥테크 창업가 네트워킹 행사
            </p>

            <div className="hero-info" style={{ justifyContent: 'center' }}>
              <div className="info-item">
                <Calendar className="info-icon" />
                <span>2025.10.30 18:00 ~ 21:00</span>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" />
                <span>코엑스</span>
              </div>
            </div>

            <p className="hero-description">
              로봇, VR/AR, AI, 자율주행 등 딥테크 분야 창업가들과 연구자들이<br />
              코파운더 매칭과 기술적 역량 확보를 위해 만나는 특별한 네트워킹 행사입니다.
            </p>

            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <motion.button
                className="btn-primary hero-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('registration')}
              >
                참여신청
              </motion.button>

              <motion.button
                className="btn-secondary hero-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                자세히 보기
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="hero-scroll-indicator">
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
