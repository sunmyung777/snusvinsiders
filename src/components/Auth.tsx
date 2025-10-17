import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

interface AuthProps {
  onSuccess?: () => void
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.name || !formData.email) {
        alert('이름과 이메일을 모두 입력해주세요.')
        return
      }

      await signIn(formData.name, formData.email)
      alert('로그인 성공!')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('로그인 오류:', error)
      alert(`로그인 실패: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>참가자 로그인</h1>
          <p>행사에 등록하신 이름과 이메일로 로그인해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-notice">
          <p>
            행사에 참가 신청하신 정보로만 로그인이 가능합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
