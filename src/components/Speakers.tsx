import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Linkedin, Twitter } from 'lucide-react';
import './Speakers.css';

const Speakers: React.FC = () => {
  const speakers = [
    {
      name: '손재권',
      title: '42dot Founder & CEO',
      company: '42dot',
      image: '/api/placeholder/150/150',
      bio: '자율주행 기술의 혁신을 이끄는 글로벌 리더',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: '박일평',
      title: 'LG 사이언스 파크 사장',
      company: 'LG',
      image: '/api/placeholder/150/150',
      bio: '혁신 생태계 구축과 스타트업 육성 전문가',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Charles Ferguson',
      title: 'General Manager',
      company: 'Globalization Partners',
      image: '/api/placeholder/150/150',
      bio: '글로벌 비즈니스 확장과 인재 관리 전문가',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: '곽성욱',
      title: 'CEO',
      company: 'SERIES VENTURES',
      image: '/api/placeholder/150/150',
      bio: '시리즈 투자와 스타트업 성장 전략 전문가',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: '서정민',
      title: 'CEO',
      company: '브랜디',
      image: '/api/placeholder/150/150',
      bio: '패션 테크 플랫폼의 혁신적 리더십',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: '송창현',
      title: '사장',
      company: '현대자동차그룹',
      image: '/api/placeholder/150/150',
      bio: '모빌리티 혁신과 미래 기술 개발 리더',
      linkedin: '#',
      twitter: '#'
    }
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
    <section className="speakers-section" id="speakers">
      <div className="container">
        <motion.div
          className="speakers-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Speakers</h2>
          <p className="section-subtitle">
            Young Tech Founders Forum 2025의 연사진을 소개합니다.<br />
            딥테크 분야의 전문가들이 최신 기술 트렌드와<br />
            창업 인사이트를 공유합니다.
          </p>
        </motion.div>

        <motion.div
          className="speakers-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {speakers.map((speaker, index) => (
                        <motion.div
              key={speaker.name}
              className="speaker-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className="speaker-image-wrapper">
                <div className="speaker-image">
                  <div className="speaker-placeholder">
                    {speaker.name.charAt(0)}
                  </div>
                </div>
                <div className="speaker-overlay">
                  <div className="speaker-social">
                    <button className="social-link" aria-label={`${speaker.name} LinkedIn`}>
                      <Linkedin size={20} />
                    </button>
                    <button className="social-link" aria-label={`${speaker.name} Twitter`}>
                      <Twitter size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="speaker-content">
                <h3 className="speaker-name">{speaker.name}</h3>
                <p className="speaker-title">{speaker.title}</p>
                <p className="speaker-company">{speaker.company}</p>
                <p className="speaker-bio">{speaker.bio}</p>
              </div>

              <div className="speaker-card-background">
                <div className="speaker-glow"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="speakers-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button className="btn-secondary speakers-btn">
            View more
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Speakers;
