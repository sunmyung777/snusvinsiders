import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Building, Briefcase, Check, AlertCircle } from 'lucide-react';
import { insertRegistration, RegistrationData, getRegistrationCountByOrganization } from '../lib/supabase';
import SuccessModal from './SuccessModal';
import './Registration.css';

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    position: '',
    privacyAgreed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{name: string, email: string} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
    setSubmitStatus('idle');
    setSubmittedData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // 대학(원)생 체크: 서울대, 고려대, 연세대인 경우 20명 제한
      const universityOrganizations = ['대학(원)생'];
      if (universityOrganizations.includes(formData.organization)) {
        const currentCount = await getRegistrationCountByOrganization(formData.organization);
        if (currentCount >= 20) {
          setSubmitStatus('error');
          setErrorMessage(`${formData.organization} 참가 인원이 마감되었습니다.`);
          setIsSubmitting(false);
          return;
        }
      }

      // 참가신청 데이터 준비
      const registrationData: Omit<RegistrationData, 'id' | 'created_at'> = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        organization: formData.organization,
        position: formData.position,
        is_founder: false,
        is_pitching: false,
        privacy_agreed: formData.privacyAgreed
      };

      // Supabase에 데이터 저장
      let savedData = null;
      const hasSupabaseConfig = process.env.REACT_APP_SUPABASE_URL &&
                               process.env.REACT_APP_SUPABASE_ANON_KEY &&
                               process.env.REACT_APP_SUPABASE_URL !== 'https://placeholder.supabase.co';

      if (hasSupabaseConfig) {
        console.log('🔄 실제 Supabase에 데이터 저장 중...');
        savedData = await insertRegistration(registrationData);
      } else {
        console.log('⚠️ Supabase 미연결 - 개발 모드');
        console.log('📝 참가신청 데이터:', registrationData);
        // 개발 모드 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

            // 참가신청 완료 처리
      console.log('✅ 참가신청이 성공적으로 완료되었습니다!');

      // 제출된 데이터 저장 (모달용)
      setSubmittedData({
        name: formData.name,
        email: formData.email
      });

      setSubmitStatus('success');
      setIsModalOpen(true);

      // 폼 초기화
      setFormData({
        name: '',
        phone: '',
        email: '',
        organization: '',
        position: '',
        privacyAgreed: false
      });

    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '참가신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration" className="registration-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">참가신청</h2>
          <p className="section-subtitle">
            YTTF 2025에 참여하여 네트워킹의 기회를 잡으세요
          </p>

          <div className="registration-container">
            <form onSubmit={handleSubmit} className="registration-form">
              {/* 기본 정보 */}
              <div className="form-section">
                <h3 className="form-section-title">기본 정보</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={20} />
                      이름 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="성함을 입력해주세요"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={20} />
                      전화번호 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="010-0000-0000"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={20} />
                      이메일 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Building size={20} />
                      소속 기관 *
                    </label>
                    <select
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">소속 기관을 선택해주세요</option>
                      <option value="INSIDERS">INSIDERS</option>
                      <option value="SNUSV">SNUSV</option>
                      <option value="시그마">시그마</option>
                      <option value="attentionX">attentionX</option>
                      <option value="Xreal">Xreal</option>
                      <option value="AIKU">AIKU</option>
                      <option value="Blockchain Valley">Blockchain Valley</option>
                      <option value="Blockchain at Yonsei">Blockchain at Yonsei</option>
                      <option value="Kasimov">Kasimov</option>
                      <option value="로보인">로보인</option>
                      <option value="서울대 멋쟁이 사자처럼">서울대 멋쟁이 사자처럼</option>
                      <option value="연세대 멋쟁이 사자처럼">연세대 멋쟁이 사자처럼</option>
                      <option value="고려대 멋쟁이 사자처럼">고려대 멋쟁이 사자처럼</option>
                      <option value="대학(원)생">대학(원)생</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Briefcase size={20} />
                      직책 *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="직책을 입력해주세요"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 개인정보 동의 */}
              <div className="form-section">
                <h3 className="form-section-title">개인정보 처리 동의</h3>

                <div className="form-group">
                  <label className="checkbox-label privacy-label">
                    <input
                      type="checkbox"
                      name="privacyAgreed"
                      checked={formData.privacyAgreed}
                      onChange={handleInputChange}
                      className="checkbox-input"
                      required
                    />
                    <span className="checkbox-custom">
                      <Check size={16} />
                    </span>
                    개인정보 수집 및 이용에 동의합니다 *
                  </label>
                  <div className="privacy-text">
                    수집하는 개인정보: 이름, 연락처, 이메일, 소속기관, 직책<br/>
                    수집목적: 행사 참가자 관리 및 행사 관련 안내<br/>
                    보유기간: 행사 종료 후 1년
                  </div>
                </div>
              </div>

              {/* 오류 메시지만 표시 (성공은 모달로) */}
              {submitStatus === 'error' && (
                <motion.div
                  className="status-message error-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle size={24} />
                  <div>
                    <h4>참가신청 중 오류가 발생했습니다</h4>
                    <p>{errorMessage || '잠시 후 다시 시도해주세요.'}</p>
                  </div>
                </motion.div>
              )}

              {/* 제출 버튼 */}
              <motion.button
                type="submit"
                className={`btn-primary submit-btn ${isSubmitting ? 'submitting' : ''}`}
                whileHover={!isSubmitting && !(!formData.privacyAgreed) ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && !(!formData.privacyAgreed) ? { scale: 0.98 } : {}}
                disabled={!formData.privacyAgreed || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    참가신청 처리중...
                  </>
                ) : (
                  '참가신청 완료'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        registrationData={submittedData}
      />
    </section>
  );
};

export default Registration;
