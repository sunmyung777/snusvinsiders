import React from 'react';
import { motion } from 'framer-motion';
import './Partners.css';

const Partners: React.FC = () => {
  const keyPartners = [
    { name: 'SNU Insiders', category: 'Hosted by', logo: 'INSIDERS' },
    { name: 'SNUSV', category: 'Co-hosted by', logo: 'SNUSV' }
  ];

  const supportingPartners = [
    { name: '로봇 학회', logo: 'ROBOT' },
    { name: 'VR/AR 연구회', logo: 'VR' },
    { name: 'AI 학회', logo: 'AI' },
    { name: '자율주행 연구소', logo: 'AUTO' },
    { name: '딥테크 창업 동아리', logo: 'DEEP' },
    { name: '기술창업 학회', logo: 'TECH' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="partners-section">
      <div className="container">
        <motion.div
          className="partners-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">KEY PARTNERS</h2>
          <p className="section-subtitle">
            NextRise 2025, Seoul 은 스타트업 생태계 구성원들이 함께 만들어 가고 있습니다.
          </p>
        </motion.div>

        {/* Key Partners */}
        <motion.div
          className="key-partners-section"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="partners-category-title">주최기관</h3>
          <div className="key-partners-grid">
            {keyPartners.map((partner, index) => (
                            <motion.div
                key={partner.name}
                className="partner-card key-partner"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="partner-logo">
                  <span className="logo-text">{partner.logo}</span>
                </div>
                <div className="partner-info">
                  <h4 className="partner-name">{partner.name}</h4>
                  <span className="partner-category">{partner.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Supporting Partners */}
        <motion.div
          className="supporting-partners-section"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="partners-category-title">협력기관</h3>
          <div className="supporting-partners-grid">
            {supportingPartners.map((partner, index) => (
                            <motion.div
                key={partner.name}
                className="partner-card supporting-partner"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="partner-logo-small">
                  <span className="logo-text-small">{partner.logo}</span>
                </div>
                <span className="partner-name-small">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partnership CTA */}
        <motion.div
          className="partnership-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="cta-content">
            <h3>파트너십 문의</h3>
            <p>Young Tech Founders Forum 2025와 함께 딥테크 생태계를 만들어가세요</p>
            <div className="cta-actions">
              <button className="btn-primary">파트너십 신청</button>
              <button className="btn-secondary">자료 다운로드</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
