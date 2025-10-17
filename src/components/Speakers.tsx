import React from 'react';
import { motion } from 'framer-motion';
import './Speakers.css';

const Speakers: React.FC = () => {
  const speaker = {
    name: '백준호',
    title: '공동 창업 & 대표',
    company: '퓨리오사AI',
    image: '/api/placeholder/400/500',
    career: [
      '서울대학교 전기·정보공학부 입학',
      '미국 조지아공과대학교(Georgia Tech)에서 학사 및 석사 취득',
      '2010~2013 AMD (GPU 사업부, 소프트웨어 엔지니어)',
      '2013~2016 삼성전자 메모리사업부 (하드웨어 엔지니어)',
      '2017~ 현재 퓨리오사AI (공동 창업 & 대표)'
    ]
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
          <h2 className="section-title">SPEAKER</h2>
          <p className="section-subtitle">
            Young Tech Founders Forum 2025의 연사를 소개합니다.
          </p>
        </motion.div>

        <motion.div
          className="speaker-feature"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="speaker-feature-image">
            <img
              src="/speaker.jpg"
              alt={speaker.name}
              className="speaker-image"
            />
          </div>

          <div className="speaker-feature-content">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="speaker-header-info">
                <h3 className="speaker-feature-name">{speaker.name}</h3>
                <p className="speaker-feature-title">{speaker.title}</p>
                <p className="speaker-feature-company">{speaker.company}</p>
              </div>

              <div className="speaker-career">
                <h4 className="career-title">약력</h4>
                <ul className="career-list">
                  {speaker.career.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Speakers;
