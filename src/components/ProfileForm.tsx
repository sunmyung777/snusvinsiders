import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Profile, updateProfile, uploadAvatar } from '../lib/supabase'
import './ProfileForm.css'

interface ProfileFormProps {
  existingProfile?: Profile
  onSuccess?: () => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({ existingProfile, onSuccess }) => {
  const { user, profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    role: '',
    company: '',
    position: '',
    phone: '',
    website: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    interests: '',
    hashtags: '',
    is_visible: true,
  })

  useEffect(() => {
    if (existingProfile || profile) {
      const currentProfile = existingProfile || profile
      if (currentProfile) {
        setFormData({
          name: currentProfile.name || '',
          bio: currentProfile.bio || '',
          role: currentProfile.role || '',
          company: currentProfile.company || '',
          position: currentProfile.position || '',
          phone: currentProfile.phone || '',
          website: currentProfile.website || '',
          linkedin_url: currentProfile.linkedin_url || '',
          github_url: currentProfile.github_url || '',
          twitter_url: currentProfile.twitter_url || '',
          interests: currentProfile.interests?.join(', ') || '',
          hashtags: currentProfile.hashtags?.join(', ') || '',
          is_visible: currentProfile.is_visible,
        })
        if (currentProfile.avatar_url) {
          setAvatarPreview(currentProfile.avatar_url)
        }
      }
    }
  }, [existingProfile, profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !user.id) {
      alert('로그인이 필요합니다.')
      return
    }

    setLoading(true)
    try {
      let avatarUrl = profile?.avatar_url

      // 아바타 업로드
      if (avatarFile && user.id) {
        try {
          avatarUrl = await uploadAvatar(avatarFile, user.id)
          console.log('✅ 이미지 업로드 성공:', avatarUrl ? '성공' : '실패')
        } catch (uploadError) {
          console.error('이미지 업로드 오류:', uploadError)
          // 이미지 업로드 실패해도 계속 진행 (선택사항)
          alert('이미지 업로드에 실패했지만 프로필은 저장됩니다.')
        }
      }

      // 프로필 업데이트 데이터
      const updates: Partial<Profile> = {
        name: formData.name,
        bio: formData.bio || undefined,
        role: formData.role || undefined,
        company: formData.company || undefined,
        position: formData.position || undefined,
        phone: formData.phone || undefined,
        website: formData.website || undefined,
        linkedin_url: formData.linkedin_url || undefined,
        github_url: formData.github_url || undefined,
        twitter_url: formData.twitter_url || undefined,
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()).filter(i => i) : [],
        hashtags: formData.hashtags ? formData.hashtags.split(',').map(h => h.trim()).filter(h => h) : [],
        is_visible: formData.is_visible,
        avatar_url: avatarUrl,
      }

      // 프로필 저장 (생성 또는 업데이트)
      let savedProfile: Profile

      // 먼저 기존 프로필이 있는지 확인
      const { getProfileByUserId } = await import('../lib/supabase')
      const existingProfile = await getProfileByUserId(user.id)

      if (existingProfile) {
        // 기존 프로필 업데이트
        console.log('📝 프로필 업데이트 중...', existingProfile.id)
        savedProfile = await updateProfile(existingProfile.id, updates)
        console.log('✅ 프로필 업데이트 성공')
      } else {
        // 새 프로필 생성
        console.log('✨ 새 프로필 생성 중...')
        const { createProfile } = await import('../lib/supabase')
        savedProfile = await createProfile({
          user_id: user.id,
          email: user.email || '',
          ...updates,
        } as Profile)
        console.log('✅ 프로필 생성 성공:', savedProfile.id)
      }

      await refreshProfile()

      alert('프로필이 저장되었습니다!')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      console.error('프로필 저장 오류:', error)
      alert(`프로필 저장 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-form-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <h2>프로필 {existingProfile ? '수정' : '등록'}</h2>

        {/* 아바tar */}
        <div className="form-group avatar-group">
          <label>프로필 사진</label>
          <div className="avatar-upload">
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
            />
          </div>
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="홍길동"
          />
        </div>

        {/* 자기소개 */}
        <div className="form-group">
          <label htmlFor="bio">자기소개</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="간단한 자기소개를 작성해주세요"
          />
        </div>

        {/* 역할/직군 */}
        <div className="form-group">
          <label htmlFor="role">역할/직군</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="예: 개발자, 디자이너, PM, 마케터"
          />
        </div>

        {/* 회사 */}
        <div className="form-group">
          <label htmlFor="company">회사</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="소속 회사명"
          />
        </div>

        {/* 직책 */}
        <div className="form-group">
          <label htmlFor="position">직책</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="예: 시니어 개발자, CTO, 팀장"
          />
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label htmlFor="phone">전화번호</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
          />
        </div>

        {/* 관심사 */}
        <div className="form-group">
          <label htmlFor="interests">관심사</label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="쉼표로 구분 (예: AI, 블록체인, 핀테크)"
          />
          <small>쉼표(,)로 구분하여 입력해주세요</small>
        </div>

        {/* 해시태그 */}
        <div className="form-group">
          <label htmlFor="hashtags">해시태그</label>
          <input
            type="text"
            id="hashtags"
            name="hashtags"
            value={formData.hashtags}
            onChange={handleChange}
            placeholder="쉼표로 구분 (예: 스타트업, 투자, 네트워킹)"
          />
          <small>쉼표(,)로 구분하여 입력해주세요</small>
        </div>

        {/* 웹사이트 */}
        <div className="form-group">
          <label htmlFor="website">웹사이트</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        {/* LinkedIn */}
        <div className="form-group">
          <label htmlFor="linkedin_url">LinkedIn</label>
          <input
            type="url"
            id="linkedin_url"
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        {/* GitHub */}
        <div className="form-group">
          <label htmlFor="github_url">GitHub</label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
        </div>

        {/* Twitter */}
        <div className="form-group">
          <label htmlFor="twitter_url">Twitter/X</label>
          <input
            type="url"
            id="twitter_url"
            name="twitter_url"
            value={formData.twitter_url}
            onChange={handleChange}
            placeholder="https://twitter.com/username"
          />
        </div>

        {/* 프로필 공개 여부 */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_visible"
              checked={formData.is_visible}
              onChange={handleChange}
            />
            <span>프로필 공개하기</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? '저장 중...' : '프로필 저장'}
        </button>
      </form>
    </div>
  )
}

export default ProfileForm
