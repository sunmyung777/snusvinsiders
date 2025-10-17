import React from 'react';
import { motion } from 'framer-motion';
import { Users, Handshake, Zap } from 'lucide-react';
import './Stats.css';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: '100',
      label: 'PARTICIPANTS',
      prefix: '+',
      color: '#4f46e5'
    },
    {
      icon: Handshake,
      number: '4',
      label: 'TECH FIELDS',
      prefix: '',
      color: '#dc2626'
    },
    {
      icon: Zap,
      number: '6',
      label: 'IR PITCHING TEAMS',
      prefix: '+',
      color: '#7c3aed'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="stats-section">
      <div className="container">
        <motion.div
          className="stats-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="stats-title">YTFF 2025 Target</h2>
        </motion.div>

        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
                            <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
                  <IconComponent
                    className="stat-icon"
                    style={{ color: stat.color }}
                    size={32}
                  />
                </div>

                <div className="stat-content">
                  <div className="stat-number">
                    <span className="stat-prefix">{stat.prefix}</span>
                    <motion.span
                      className="stat-value"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.span>
                  </div>
                  <p className="stat-label">{stat.label}</p>
                </div>

                <div className="stat-background">
                  <div
                    className="stat-glow"
                    style={{ backgroundColor: `${stat.color}10` }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="stats-description"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>
            국내 대학 최대 규모의 힉생 창업 네트워크에서
            <br className="mobile-break" />
            혁신과 협력의 새로운 기회를 발견하세요.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
