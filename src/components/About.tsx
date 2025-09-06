import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Lightbulb, Zap } from 'lucide-react';
import './About.css';

const About: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: '연사 강연',
      description: '딥테크 분야 전문가의 최신 기술 트렌드와 창업 인사이트 공유',
      color: '#4f46e5'
    },
    {
      icon: Zap,
      title: 'IR 피칭',
      description: '분야별 창업팀의 기술 발표와 QnA를 통한 아이디어 교환',
      color: '#059669'
    },
    {
      icon: Globe,
      title: '네트워킹',
      description: '코파운더 매칭과 기술적 역량 확보를 위한 자유로운 교류',
      color: '#dc2626'
    },
    {
      icon: Lightbulb,
      title: '식사 & 교류',
      description: '편안한 분위기에서 진행되는 심화 네트워킹과 협력 논의',
      color: '#7c3aed'
    }
  ];

  return (
    <section className="about-section" id="about">
      <div className="container">
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="about-title">
            <span className="title-highlight">한국 최고의</span><br />
            <span className="title-highlight">딥테크 창업가</span><br />
            <span className="title-highlight">네트워킹</span><br />
            <span className="title-main">행사!</span>
          </h2>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="about-description">
              Young Tech Founders Forum은 한국의 젊은 기술 창업가들과<br />
              딥테크 분야 연구자들이 만나는 특별한 네트워킹 행사입니다.
            </p>

            <p className="about-details">
              로봇, VR/AR, AI, 자율주행 등 딥테크 분야의<br />
              창업가들과 연구자들이 한 자리에 모여 아이디어를 공유하고<br />
              코파운더 매칭과 기술적 역량 확보의 기회를 제공합니다.
            </p>

            <div className="about-highlight">
              <p>
                <strong>인사이더스, SNUSV 구성원들의 코파운더 매칭</strong>을 통해<br />
                창업팀들의 기술적 역량 확보와 네트워킹을 지원합니다.
              </p>
            </div>

            <p className="about-community">
              딥테크 창업에 관심있는 연구자, 창업가, 투자자들이<br />
              <strong>한 자리에 모여</strong> 기술적 인사이트를 공유하고<br />
              새로운 협력 기회를 발견합니다.
            </p>
          </motion.div>

          <motion.div
            className="about-visual"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="feature-cards">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="feature-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div
                      className="feature-icon"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <IconComponent
                        size={24}
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="about-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <button className="btn-primary about-btn">
            자세히 알아보기
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
