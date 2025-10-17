import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import './Events.css';

const Events: React.FC = () => {
  const events = [
    {
      title: '사전 등록',
      time: '18:45 - 19:00',
      duration: '15분',
      status: 'upcoming'
    },
    {
      title: '행사 소개 및 후원사 소개',
      time: '19:00 - 19:20',
      duration: '20분',
      description: '후원사 안내 및 홍보',
      status: 'upcoming'
    },
    {
      title: '연사 초청 강연',
      time: '19:20 - 19:50',
      duration: '30분',
      description: '기술에서 창업으로: 엔지니어의 혁신이 스타트업을 만든다',
      speaker: '퓨리오사AI 백준호 대표님',
      status: 'upcoming'
    },
    {
      title: '6개 팀 IR 피칭',
      time: '19:50 - 20:30',
      duration: '40분',
      description: '학회 별 1개 팀, 총 6팀 IR 피칭',
      note: '각 학회별 피칭 팀 사전 선정',
      status: 'upcoming'
    },
    {
      title: '식사 및 기술 분야별 네트워킹',
      time: '20:30 - 21:10',
      duration: '40분',
      description: '테이블 당 자리 배정 후 아이스브레이킹 진행',
      status: 'upcoming'
    },
    {
      title: '자유 네트워킹',
      time: '21:10 - 21:50',
      duration: '40분',
      description: '다양한 기술 분야 학회원 간의 네트워킹',
      status: 'upcoming'
    },
    {
      title: '경품 추첨 및 행사 종료',
      time: '21:50 - 22:00',
      duration: '10분',
      description: '',
      status: 'upcoming'
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
    <section className="events-section" id="events">
      <div className="container">
        <motion.div
          className="events-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            EVENT<br />
            TIMELINE
          </h2>
          <p className="section-subtitle">
            Young Tech Founders Forum 2025의 세션별 일정입니다.<br />
            딥테크 창업가들과의 특별한 만남이 기다리고 있습니다.
          </p>
        </motion.div>

        <motion.div
          className="timeline-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="timeline-line"></div>
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                <div className="timeline-time">{event.time}</div>
              </div>

              <motion.div
                className={`timeline-card ${event.status}`}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3 className="timeline-title">{event.title}</h3>
                    <span className="timeline-duration">{event.duration}</span>
                  </div>

                  {event.description && (
                    <p className="timeline-description">{event.description}</p>
                  )}

                  {event.speaker && (
                    <p className="timeline-speaker">
                      <strong>연사:</strong> {event.speaker}
                    </p>
                  )}

                  {event.note && (
                    <p className="timeline-note">{event.note}</p>
                  )}
                </div>

                <div className="timeline-arrow"></div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
