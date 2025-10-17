import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Building, Briefcase, Rocket, FileText, Check, Upload, AlertCircle } from 'lucide-react';
import { insertRegistration, uploadPitchFile, RegistrationData } from '../lib/supabase';
import SuccessModal from './SuccessModal';
import './Registration.css';

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    position: '',
    isFounder: false,
    companyName: '',
    isPitching: false,
    pitchFile: null as File | null,
    privacyAgreed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{name: string, email: string} | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, pitchFile: file }));
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
      let pitchFileUrl: string | undefined;

      // PDF 파일 업로드 (IR 피칭 참여 시)
      if (formData.isPitching && formData.pitchFile) {
        if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY) {
          const fileName = `${Date.now()}_${formData.pitchFile.name}`;
          pitchFileUrl = await uploadPitchFile(formData.pitchFile, fileName);
        } else {
          console.log('📎 피칭 파일 (Supabase 미연결):', formData.pitchFile.name);
          pitchFileUrl = `placeholder-url/${formData.pitchFile.name}`;
        }
      }

      // 참가신청 데이터 준비
      const registrationData: Omit<RegistrationData, 'id' | 'created_at'> = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        organization: formData.organization,
        position: formData.position,
        is_founder: formData.isFounder,
        company_name: formData.isFounder ? formData.companyName : undefined,
        is_pitching: formData.isPitching,
        pitch_file_url: pitchFileUrl,
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
        isFounder: false,
        companyName: '',
        isPitching: false,
        pitchFile: null,
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
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="소속 회사/기관명을 입력해주세요"
                      required
                    />
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

              {/* 창업 정보 */}
              <div className="form-section">
                <h3 className="form-section-title">창업 정보</h3>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFounder"
                      checked={formData.isFounder}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom">
                      <Check size={16} />
                    </span>
                    <Rocket size={20} />
                    창업을 하셨나요?
                  </label>
                </div>

                {formData.isFounder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="form-group"
                  >
                    <label className="form-label">
                      <Building size={20} />
                      창업 회사명 *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="창업하신 회사명을 입력해주세요"
                      required={formData.isFounder}
                    />
                  </motion.div>
                )}
              </div>

              {/* IR 피칭 정보 */}
              <div className="form-section">
                <h3 className="form-section-title">IR 피칭</h3>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPitching"
                      checked={formData.isPitching}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom">
                      <Check size={16} />
                    </span>
                    <FileText size={20} />
                    IR 피칭에 참여하시겠습니까?
                  </label>
                </div>

                {formData.isPitching && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="form-group"
                  >
                    <label className="form-label">
                      <Upload size={20} />
                      피칭 자료 (PDF) *
                    </label>
                    <div className="file-upload">
                      <input
                        type="file"
                        name="pitchFile"
                        onChange={handleFileChange}
                        className="file-input"
                        accept=".pdf"
                        required={formData.isPitching}
                      />
                      <div className="file-upload-text">
                        {formData.pitchFile ? formData.pitchFile.name : 'PDF 파일을 선택해주세요'}
                      </div>
                    </div>
                  </motion.div>
                )}
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
