import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, Profile, verifyParticipant, RegistrationData } from '../lib/supabase'

interface AuthContextType {
  user: RegistrationData | null // participant의 별칭
  participant: RegistrationData | null
  profile: Profile | null
  loading: boolean
  signIn: (name: string, email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [participant, setParticipant] = useState<RegistrationData | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadParticipantProfile = async (participantId: string) => {
    try {
      // user_id로 프로필 조회
      const { getProfileByUserId } = await import('../lib/supabase')
      const profile = await getProfileByUserId(participantId)

      if (profile) {
        console.log('✅ 프로필 로드 성공:', profile.name)
        setProfile(profile)
      } else {
        console.log('ℹ️ 프로필이 아직 생성되지 않았습니다.')
        setProfile(null)
      }
    } catch (error) {
      console.error('❌ 프로필 로드 오류:', error)
      setProfile(null)
    }
  }

  useEffect(() => {
    // localStorage에서 로그인 정보 복원
    const savedParticipant = localStorage.getItem('participant')
    if (savedParticipant) {
      try {
        const participantData = JSON.parse(savedParticipant) as RegistrationData
        setParticipant(participantData)
        if (participantData.id) {
          loadParticipantProfile(participantData.id)
        }
      } catch (error) {
        console.error('참가자 정보 복원 오류:', error)
        localStorage.removeItem('participant')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (name: string, email: string) => {
    // 참가자 인증
    const participantData = await verifyParticipant(name, email)

    if (!participantData) {
      throw new Error('행사에 등록되지 않은 정보입니다. 이름과 이메일을 확인해주세요.')
    }

    // 로그인 성공
    setParticipant(participantData)
    localStorage.setItem('participant', JSON.stringify(participantData))

    // 프로필이 있으면 로드
    if (participantData.id) {
      await loadParticipantProfile(participantData.id)
    }
  }

  const signOut = async () => {
    setParticipant(null)
    setProfile(null)
    localStorage.removeItem('participant')
  }

  const refreshProfile = async () => {
    if (participant?.id) {
      await loadParticipantProfile(participant.id)
    }
  }

  const value = {
    user: participant, // participant를 user로도 노출
    participant,
    profile,
    loading,
    signIn,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
