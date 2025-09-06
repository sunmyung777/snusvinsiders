import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, MapPin, Clock } from 'lucide-react';
import './Events.css';

const Events: React.FC = () => {
  const events = [
    {
      title: '행사 소개 및 인트로',
      date: '2025년 10월 30일',
      organizer: 'YTFF 2025',
      time: '18:00 - 18:30',
      location: '코엑스',
      status: 'upcoming',
      participants: 100,
      description: '행사 소개, 후원사 소개 및 네트워킹 가이드'
    },
    {
      title: '연사님 강연',
      date: '2025년 10월 30일',
      organizer: 'YTFF 2025',
      time: '18:30 - 19:00',
      location: '코엑스 메인홀',
      status: 'upcoming',
      participants: 100,
      description: '딥테크 분야 전문가의 기술 트렌드와 창업 인사이트'
    },
    {
      title: 'IR 피칭 세션',
      date: '2025년 10월 30일',
      organizer: 'YTFF 2025',
      time: '19:00 - 19:40',
      location: '코엑스 메인홀',
      status: 'upcoming',
      participants: 100,
      description: '분야별 창업팀 스피치 + QnA (인사이더스, SNUSV 팀 포함)'
    },
    {
      title: '네트워킹 및 식사',
      date: '2025년 10월 30일',
      organizer: 'YTFF 2025',
      time: '19:40 - 21:00',
      location: '코엑스 네트워킹 라운지',
      status: 'upcoming',
      participants: 100,
      description: '자유로운 네트워킹과 코파운더 매칭 기회'
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
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-organizer">주최: {event.organizer}</p>
                  {event.description && (
                    <p className="timeline-description">{event.description}</p>
                  )}

                  <div className="timeline-details">
                    <div className="timeline-detail">
                      <MapPin className="detail-icon" size={16} />
                      <span>{event.location}</span>
                    </div>
                    <div className="timeline-detail">
                      <span className="participants-info">참가자 {event.participants}명</span>
                    </div>
                  </div>
                </div>

                <div className="timeline-arrow"></div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="events-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button className="btn-secondary events-btn">
            View more
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
