import React from 'react';
import { motion } from 'framer-motion';
import './Partners.css';

const Partners: React.FC = () => {
  const keyPartners = [
    { name: 'INSIDERS', category: 'Hosted by', logo: 'INSIDERS' },
    { name: 'SNUSV', category: 'Hosted by', logo: 'SNUSV' }
  ];

  const supportingPartners = [
    { name: '고려대 AI 학회', logo: 'AIKU' },
    { name: '서울대 AI 학회', logo: 'attentionX' },
    { name: '서울대 로보틱스 학회', logo: '시그마' }
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
            YTFF 2025 은 스타트업 생태계 구성원들이 함께 만들어 가고 있습니다.
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
      </div>
    </section>
  );
};

export default Partners;
