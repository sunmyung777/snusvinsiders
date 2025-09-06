import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Phone, Mail, Building, Briefcase, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { searchRegistrations, RegistrationData } from '../lib/supabase';
import './RegistrationCheckModal.css';

interface RegistrationCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationCheckModal: React.FC<RegistrationCheckModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RegistrationData[]>([]);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'success' | 'error' | 'empty'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSearching(true);
    setSearchStatus('idle');
    setErrorMessage('');
    setSearchResults([]);

    try {
      console.log(`🔍 이름: ${name}, 이메일: ${email}로 검색 중...`);
      const results = await searchRegistrations('name_email', name.trim(), email.trim());

      if (results.length > 0) {
        setSearchResults(results);
        setSearchStatus('success');
        console.log(`✅ ${results.length}개의 신청 내역을 찾았습니다.`);
      } else {
        setSearchStatus('empty');
        console.log('❌ 신청 내역을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setSearchResults([]);
    setSearchStatus('idle');
    setErrorMessage('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            onClick={handleClose}
          />

          {/* 모달 콘텐츠 */}
          <motion.div
            className="registration-check-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="modal-content-wrapper"
              initial={{ scale: 0.7, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  <Search size={24} />
                  참가신청 확인
                </h2>
                <button className="modal-close-btn" onClick={handleClose}>
                  <X size={24} />
                </button>
              </div>

            <div className="modal-body">
              {/* 검색 폼 */}
              <form onSubmit={handleSearch} className="search-form">
                <div className="form-description">
                  <p>참가신청 시 입력한 <strong>이름</strong>과 <strong>이메일</strong>을 정확히 입력해주세요.</p>
                </div>

                <div className="search-input-group">
                  <div className="input-field">
                    <label htmlFor="name">이름</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      className="search-input"
                      required
                    />
                  </div>

                  <div className="input-field">
                    <label htmlFor="email">이메일</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      className="search-input"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="search-btn btn-primary"
                  disabled={isSearching || !name.trim() || !email.trim()}
                >
                  {isSearching ? (
                    <>
                      <div className="loading-spinner"></div>
                      검색중...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      신청 내역 확인
                    </>
                  )}
                </button>
              </form>

              {/* 검색 결과 */}
              <div className="search-results">
                {searchStatus === 'success' && searchResults.length > 0 && (
                  <motion.div
                    className="results-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="results-header">
                      <CheckCircle className="success-icon" size={20} />
                      <h3>{searchResults.length}개의 신청 내역을 찾았습니다</h3>
                    </div>

                    {searchResults.map((registration, index) => (
                      <motion.div
                        key={registration.id}
                        className="registration-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="registration-header">
                          <h4 className="applicant-name">
                            <User size={18} />
                            {registration.name}
                          </h4>
                          <span className="registration-date">
                            <Calendar size={16} />
                            {formatDate(registration.created_at || '')}
                          </span>
                        </div>

                        <div className="registration-details">
                          <div className="detail-row">
                            <Phone size={16} />
                            <span>{registration.phone}</span>
                          </div>
                          <div className="detail-row">
                            <Mail size={16} />
                            <span>{registration.email}</span>
                          </div>
                          <div className="detail-row">
                            <Building size={16} />
                            <span>{registration.organization}</span>
                          </div>
                          <div className="detail-row">
                            <Briefcase size={16} />
                            <span>{registration.position}</span>
                          </div>

                          {registration.is_founder && (
                            <div className="detail-row founder-info">
                              <span className="badge founder-badge">창업자</span>
                              {registration.company_name && (
                                <span>회사: {registration.company_name}</span>
                              )}
                            </div>
                          )}

                          {registration.is_pitching && (
                            <div className="detail-row pitching-info">
                              <FileText size={16} />
                              <span className="badge pitching-badge">IR 피칭 참여</span>
                              {registration.pitch_file_url && (
                                <a
                                  href={registration.pitch_file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="file-link"
                                >
                                  피칭 자료 보기
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {searchStatus === 'empty' && (
                  <motion.div
                    className="no-results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle size={48} className="no-results-icon" />
                    <h3>신청 내역을 찾을 수 없습니다</h3>
                    <p>입력하신 정보로 등록된 참가신청이 없습니다.<br/>
                    다른 정보로 다시 검색해보세요.</p>
                  </motion.div>
                )}

                {searchStatus === 'error' && (
                  <motion.div
                    className="error-results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle size={48} className="error-icon" />
                    <h3>검색 중 오류가 발생했습니다</h3>
                    <p>{errorMessage || '잠시 후 다시 시도해주세요.'}</p>
                  </motion.div>
                )}
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegistrationCheckModal;

