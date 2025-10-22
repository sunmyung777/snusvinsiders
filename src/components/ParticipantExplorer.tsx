import React, { useState, useEffect, useCallback } from 'react'
import { Profile, searchProfiles, getAllProfiles, ProfileSearchParams, addLike, removeLike, checkLike, getLikeCount } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import './ParticipantExplorer.css'

// 임시 데이터
const MOCK_PROFILES: Profile[] = [
  {
    id: 'temp-1',
    email: 'kim.developer@example.com',
    name: '김개발',
    role: '풀스택 개발자',
    company: '스타트업A',
    position: 'CTO',
    bio: '10년차 개발자로 AI와 블록체인 기술에 관심이 많습니다. 스타트업 창업을 준비하고 있습니다.',
    interests: ['AI', '블록체인', '웹3.0', '스타트업'],
    hashtags: ['창업', '투자유치', '개발자'],
    linkedin_url: 'https://linkedin.com/in/kim-developer',
    github_url: 'https://github.com/kim-developer',
    is_visible: true,
  },
  {
    id: 'temp-2',
    email: 'lee.designer@example.com',
    name: '이디자인',
    role: 'UI/UX 디자이너',
    company: '디자인스튜디오',
    position: '리드 디자이너',
    bio: 'B2B SaaS 제품 디자인 전문가입니다. 사용자 경험 개선에 열정이 있습니다.',
    interests: ['UX디자인', 'SaaS', '프로덕트디자인'],
    hashtags: ['디자인', '협업', 'B2B'],
    website: 'https://portfolio.example.com',
    is_visible: true,
  },
  {
    id: 'temp-3',
    email: 'park.pm@example.com',
    name: '박프로덕트',
    role: 'Product Manager',
    company: '테크기업B',
    position: 'Senior PM',
    bio: '5년차 PM으로 여러 성공적인 프로덕트 런칭 경험이 있습니다. 데이터 기반 의사결정을 중요하게 생각합니다.',
    interests: ['프로덕트매니지먼트', '그로스해킹', '애자일'],
    hashtags: ['PM', '그로스', '데이터분석'],
    linkedin_url: 'https://linkedin.com/in/park-pm',
    is_visible: true,
  },
  {
    id: 'temp-4',
    email: 'choi.founder@example.com',
    name: '최창업',
    role: 'Founder & CEO',
    company: '핀테크스타트업',
    position: 'CEO',
    bio: '핀테크 스타트업 2년차 대표입니다. 시리즈A 투자 유치를 준비하고 있습니다.',
    interests: ['핀테크', '투자유치', '팀빌딩'],
    hashtags: ['창업가', '핀테크', '시리즈A'],
    linkedin_url: 'https://linkedin.com/in/choi-founder',
    website: 'https://fintech-startup.example.com',
    is_visible: true,
  },
  {
    id: 'temp-5',
    email: 'jung.marketer@example.com',
    name: '정마케터',
    role: '그로스 마케터',
    company: '커머스플랫폼',
    position: '마케팅 팀장',
    bio: '퍼포먼스 마케팅과 그로스 해킹을 전문으로 합니다. ROI 중심의 마케팅 전략을 수립합니다.',
    interests: ['그로스마케팅', '퍼포먼스마케팅', '데이터분석'],
    hashtags: ['마케팅', '그로스', 'ROI'],
    twitter_url: 'https://twitter.com/jung-marketer',
    is_visible: true,
  },
  {
    id: 'temp-6',
    email: 'kang.investor@example.com',
    name: '강투자',
    role: 'VC Investor',
    company: '벤처캐피탈C',
    position: 'Investment Manager',
    bio: '초기 스타트업 투자를 전문으로 하는 VC입니다. 테크 기반 스타트업에 관심이 많습니다.',
    interests: ['벤처투자', '스타트업', '딥테크'],
    hashtags: ['VC', '투자', '스타트업'],
    linkedin_url: 'https://linkedin.com/in/kang-investor',
    is_visible: true,
  },
  {
    id: 'temp-7',
    email: 'yoon.data@example.com',
    name: '윤데이터',
    role: '데이터 사이언티스트',
    company: 'AI연구소',
    position: 'Senior Data Scientist',
    bio: '머신러닝과 딥러닝을 활용한 비즈니스 문제 해결에 집중하고 있습니다.',
    interests: ['머신러닝', '딥러닝', 'AI', '데이터분석'],
    hashtags: ['데이터사이언스', 'AI', '머신러닝'],
    github_url: 'https://github.com/yoon-data',
    linkedin_url: 'https://linkedin.com/in/yoon-data',
    is_visible: true,
  },
  {
    id: 'temp-8',
    email: 'shin.sales@example.com',
    name: '신세일즈',
    role: 'B2B Sales Lead',
    company: 'SaaS기업',
    position: '영업이사',
    bio: 'B2B SaaS 영업 10년차입니다. 엔터프라이즈 고객사 확보에 강점이 있습니다.',
    interests: ['B2B세일즈', 'SaaS', '엔터프라이즈'],
    hashtags: ['영업', 'B2B', 'SaaS'],
    linkedin_url: 'https://linkedin.com/in/shin-sales',
    is_visible: true,
  },
]

interface ParticipantExplorerProps {
  onChatStart?: (profileId: string) => void
}

const ParticipantExplorer: React.FC<ParticipantExplorerProps> = ({ onChatStart }) => {
  const { user, profile: currentProfile } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<ProfileSearchParams>({
    name: '',
    role: '',
    company: '',
  })
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Map<string, number>>(new Map())

  const loadProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllProfiles()

      // 실제 데이터가 없으면 임시 데이터 사용
      if (data.length === 0) {
        console.log('📝 실제 데이터가 없어 임시 데이터를 표시합니다.')
        setProfiles(MOCK_PROFILES)

        // 임시 좋아요 수 설정
        const mockCounts = new Map<string, number>()
        MOCK_PROFILES.forEach((profile, index) => {
          mockCounts.set(profile.id, Math.floor(Math.random() * 20) + 1)
        })
        setLikeCounts(mockCounts)
      } else {
        setProfiles(data)

        // Load like counts for all profiles
        if (currentProfile) {
          await loadLikeStatus(data)
        }
      }
    } catch (error) {
      console.error('프로필 로드 오류:', error)
      console.log('⚠️ 오류 발생으로 임시 데이터를 표시합니다.')
      setProfiles(MOCK_PROFILES)

      // 임시 좋아요 수 설정
      const mockCounts = new Map<string, number>()
      MOCK_PROFILES.forEach((profile, index) => {
        mockCounts.set(profile.id, Math.floor(Math.random() * 20) + 1)
      })
      setLikeCounts(mockCounts)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile])

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  const loadLikeStatus = async (profileList: Profile[]) => {
    if (!currentProfile) return

    const liked = new Set<string>()
    const counts = new Map<string, number>()

    await Promise.all(
      profileList.map(async (profile) => {
        try {
          const isLiked = await checkLike(currentProfile.id, profile.id)
          if (isLiked) {
            liked.add(profile.id)
          }
          const count = await getLikeCount(profile.id)
          counts.set(profile.id, count)
        } catch (error) {
          console.error('좋아요 상태 확인 오류:', error)
        }
      })
    )

    setLikedProfiles(liked)
    setLikeCounts(counts)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await searchProfiles(searchParams)
      setProfiles(data)

      if (currentProfile) {
        await loadLikeStatus(data)
      }
    } catch (error) {
      console.error('검색 오류:', error)
      alert('검색 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleLikeToggle = async (profileId: string) => {
    if (!currentProfile) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const isLiked = likedProfiles.has(profileId)

      if (isLiked) {
        await removeLike(currentProfile.id, profileId)
        setLikedProfiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(profileId)
          return newSet
        })
        setLikeCounts(prev => {
          const newMap = new Map(prev)
          const currentCount = newMap.get(profileId) || 0
          newMap.set(profileId, Math.max(0, currentCount - 1))
          return newMap
        })
      } else {
        await addLike(currentProfile.id, profileId)
        setLikedProfiles(prev => new Set(prev).add(profileId))
        setLikeCounts(prev => {
          const newMap = new Map(prev)
          const currentCount = newMap.get(profileId) || 0
          newMap.set(profileId, currentCount + 1)
          return newMap
        })
      }
    } catch (error) {
      console.error('좋아요 오류:', error)
      alert('오류가 발생했습니다.')
    }
  }

  const handleReset = () => {
    setSearchParams({
      name: '',
      role: '',
      company: '',
    })
    loadProfiles()
  }

  const handleChatStart = (profile: Profile) => {
    if (!currentProfile) {
      alert('채팅을 시작하려면 먼저 프로필을 작성해주세요.')
      return
    }
    if (onChatStart) {
      onChatStart(profile.id)
    }
  }

  return (
    <div className="participant-explorer">
      <div className="explorer-header">
        <h1>참가자 탐색</h1>
        <p>관심 있는 참가자를 찾아보세요</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-fields">
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="이름으로 검색"
              value={searchParams.name || ''}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            />
          </div>

          <div className="search-field">
            <select
              value={searchParams.role || ''}
              onChange={(e) => setSearchParams({ ...searchParams, role: e.target.value })}
            >
              <option value="">직군 선택</option>
              <option value="개발자">개발자</option>
              <option value="디자이너">디자이너</option>
              <option value="PM">PM</option>
              <option value="마케터">마케터</option>
              <option value="기획자">기획자</option>
              <option value="데이터 분석가">데이터 분석가</option>
              <option value="영업/세일즈">영업/세일즈</option>
              <option value="HR/인사">HR/인사</option>
              <option value="재무/회계">재무/회계</option>
              <option value="투자자">투자자</option>
              <option value="CEO/경영진">CEO/경영진</option>
              <option value="학생">학생</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className="search-field">
            <select
              value={searchParams.company || ''}
              onChange={(e) => setSearchParams({ ...searchParams, company: e.target.value })}
            >
              <option value="">회사 선택</option>
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
              <option value="서울대">서울대</option>
              <option value="고려대">고려대</option>
              <option value="연세대">연세대</option>
            </select>
          </div>
        </div>

        <div className="search-buttons">
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? '검색 중...' : '검색'}
          </button>
          <button type="button" className="reset-button" onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="loading">참가자 정보를 불러오는 중...</div>
      ) : (
        <div className="profiles-grid">
          {profiles.length === 0 ? (
            <div className="no-results">
              <p>참가자를 찾을 수 없습니다.</p>
            </div>
          ) : (
            profiles
              .filter(p => p.id !== currentProfile?.id) // 자신의 프로필은 제외
              .map((profile) => (
                <div key={profile.id} className="profile-card">
                  <div className="profile-card-header">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.name} className="profile-avatar" />
                    ) : (
                      <div className="profile-avatar-placeholder">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <button
                      className={`like-button ${likedProfiles.has(profile.id) ? 'liked' : ''}`}
                      onClick={() => handleLikeToggle(profile.id)}
                      disabled={!currentProfile}
                    >
                      {likedProfiles.has(profile.id) ? (
                        <span className="heart-icon filled">❤️</span>
                      ) : (
                        <span className="heart-icon">🤍</span>
                      )}
                    </button>
                  </div>

                  <div className="profile-card-body">
                    <h3>{profile.name}</h3>

                    {profile.role && (
                      <p className="profile-role">{profile.role}</p>
                    )}

                    {profile.company && (
                      <p className="profile-company">{profile.company}</p>
                    )}

                    {profile.position && (
                      <p className="profile-position">{profile.position}</p>
                    )}

                    {profile.bio && (
                      <p className="profile-bio">{profile.bio}</p>
                    )}

                    {profile.hashtags && profile.hashtags.length > 0 && (
                      <div className="profile-hashtags">
                        {profile.hashtags.map((tag, index) => (
                          <span key={index} className="hashtag">#{tag}</span>
                        ))}
                      </div>
                    )}

                    {profile.interests && profile.interests.length > 0 && (
                      <div className="profile-interests">
                        {profile.interests.map((interest, index) => (
                          <span key={index} className="interest-tag">{interest}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="profile-card-footer">
                    <div className="social-links">
                      {profile.linkedin_url && (
                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                          💼
                        </a>
                      )}
                      {profile.github_url && (
                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer" title="GitHub">
                          🐙
                        </a>
                      )}
                      {profile.twitter_url && (
                        <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" title="Twitter">
                          🐦
                        </a>
                      )}
                      {profile.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" title="Website">
                          🌐
                        </a>
                      )}
                    </div>

                    <div className="profile-actions">
                      <span className="like-count">
                        {likeCounts.get(profile.id) || 0} 좋아요
                      </span>
                      <button
                        className="chat-button"
                        onClick={() => handleChatStart(profile)}
                        disabled={!currentProfile}
                      >
                        ✉️ 메시지
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}

export default ParticipantExplorer
