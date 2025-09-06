import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Calendar, MapPin } from 'lucide-react';
import './SuccessModal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData?: {
    name: string;
    email: string;
  } | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, registrationData }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 모달 콘텐츠 */}
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.7, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="modal-content">
              {/* 닫기 버튼 */}
              <button className="modal-close-btn" onClick={onClose}>
                <X size={24} />
              </button>

              {/* 성공 아이콘 */}
              <motion.div
                className="success-icon-container"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="success-icon" size={64} />
              </motion.div>

              {/* 제목 */}
              <motion.h2
                className="modal-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                참가신청이 완료되었습니다!
              </motion.h2>

              {/* 메시지 */}
              <motion.div
                className="modal-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="main-message">
                  <strong>{registrationData?.name || '참가자'}</strong>님의 Young Tech Founders Forum 2025 참가신청이 정상적으로 접수되었습니다.
                </p>

                <div className="info-box">
                  <div className="info-item">
                    <Calendar size={18} />
                    <span>행사 일정: <strong>2025년 10월 30일 18:00~21:00</strong></span>
                  </div>
                  <div className="info-item">
                    <MapPin size={18} />
                    <span>장소: <strong>코엑스 (서울)</strong></span>
                  </div>
                </div>

                <p className="sub-message">
                  궁금한 사항이 있으시면 언제든 문의해 주세요.
                </p>
              </motion.div>

              {/* 액션 버튼들 */}
              <motion.div
                className="modal-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button className="btn-secondary modal-btn" onClick={onClose}>
                  계속 둘러보기
                </button>
                <button
                  className="btn-primary modal-btn"
                  onClick={() => {
                    window.open('mailto:ytff2025@gmail.com', '_blank');
                  }}
                >
                  문의하기
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
