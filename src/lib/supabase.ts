import { createClient } from '@supabase/supabase-js'

// Supabase 프로젝트 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key'

// 환경변수 체크
if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 참가신청 데이터 타입 정의
export interface RegistrationData {
  id?: string
  name: string
  phone: string
  email: string
  organization: string
  position: string
  is_founder: boolean
  company_name?: string
  is_pitching: boolean
  pitch_file_url?: string
  privacy_agreed: boolean
  created_at?: string
}

// 특정 organization의 등록자 수 조회
export const getRegistrationCountByOrganization = async (organization: string): Promise<number> => {
  console.log(`🔍 ${organization} 등록자 수 조회 중...`);

  // 환경변수 체크
  const hasSupabaseConfig = process.env.REACT_APP_SUPABASE_URL &&
                           process.env.REACT_APP_SUPABASE_ANON_KEY &&
                           process.env.REACT_APP_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (!hasSupabaseConfig) {
    console.warn('⚠️ Supabase 미연결 - 개발 모드 (카운트 0 반환)');
    return 0;
  }

  const { count, error } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('organization', organization);

  if (error) {
    console.error('❌ 등록자 수 조회 오류:', error);
    throw error;
  }

  console.log(`✅ ${organization} 등록자 수: ${count || 0}명`);
  return count || 0;
}

// 참가신청 데이터 삽입
export const insertRegistration = async (data: Omit<RegistrationData, 'id' | 'created_at'>) => {
  console.log('🔄 Supabase 데이터 삽입 시도:', data);

  const { data: result, error } = await supabase
    .from('registrations')
    .insert([data])
    .select()

  if (error) {
    console.error('❌ Supabase 삽입 오류:', error);
    throw error
  }

  console.log('✅ Supabase 데이터 삽입 성공:', result[0]);
  return result[0]
}

// 파일 업로드 (PDF)
export const uploadPitchFile = async (file: File, fileName: string) => {
  const { error } = await supabase.storage
    .from('pitch-files')
    .upload(fileName, file)

  if (error) {
    throw error
  }

  // 업로드된 파일의 공개 URL 가져오기
  const { data: urlData } = supabase.storage
    .from('pitch-files')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

// 참가신청 검색 (이름 + 이메일)
export const searchRegistrations = async (
  searchType: 'name_email',
  name: string,
  email: string
): Promise<RegistrationData[]> => {
  console.log(`🔍 이름: "${name}", 이메일: "${email}" 검색 중...`);

  // 환경변수 체크
  const hasSupabaseConfig = process.env.REACT_APP_SUPABASE_URL &&
                           process.env.REACT_APP_SUPABASE_ANON_KEY &&
                           process.env.REACT_APP_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (!hasSupabaseConfig) {
    console.warn('⚠️ Supabase 미연결 - 개발 모드 시뮬레이션');

    // 개발 모드에서는 입력된 이름과 이메일이 일치하는지 확인
    const mockData = [
      {
        id: 'dev-1',
        name: '김개발',
        phone: '010-1234-5678',
        email: 'dev@example.com',
        organization: '개발회사',
        position: '개발자',
        is_founder: true,
        company_name: '스타트업',
        is_pitching: true,
        pitch_file_url: 'https://example.com/pitch.pdf',
        privacy_agreed: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'dev-2',
        name: '박테스트',
        phone: '010-9876-5432',
        email: 'test@example.com',
        organization: '테스트회사',
        position: '매니저',
        is_founder: false,
        is_pitching: false,
        privacy_agreed: true,
        created_at: new Date().toISOString()
      }
    ];

    // 이름과 이메일이 정확히 일치하는 데이터만 반환
    return mockData.filter(item =>
      item.name.toLowerCase() === name.toLowerCase() &&
      item.email.toLowerCase() === email.toLowerCase()
    );
  }

  // 이름과 이메일이 정확히 일치하는 데이터 검색
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .ilike('name', name)
    .ilike('email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ 검색 오류:', error);
    throw error;
  }

  console.log(`✅ ${data?.length || 0}개의 결과를 찾았습니다.`);
  return data || [];
}

// ==================== 참가자 로그인 기능 ====================

// 참가자 인증 (이름 + 이메일로 참가 신청 여부 확인)
export const verifyParticipant = async (name: string, email: string): Promise<RegistrationData | null> => {
  console.log(`🔐 참가자 인증 시도: 이름="${name}", 이메일="${email}"`);

  // 환경변수 체크
  const hasSupabaseConfig = process.env.REACT_APP_SUPABASE_URL &&
                           process.env.REACT_APP_SUPABASE_ANON_KEY &&
                           process.env.REACT_APP_SUPABASE_URL !== 'https://placeholder.supabase.co';

  if (!hasSupabaseConfig) {
    console.warn('⚠️ Supabase 미연결 - 개발 모드 시뮬레이션');

    // 개발 모드용 목 데이터
    const mockData: RegistrationData[] = [
      {
        id: 'dev-1',
        name: '김개발',
        phone: '010-1234-5678',
        email: 'dev@example.com',
        organization: '개발회사',
        position: '개발자',
        is_founder: true,
        company_name: '스타트업',
        is_pitching: true,
        pitch_file_url: 'https://example.com/pitch.pdf',
        privacy_agreed: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'dev-2',
        name: '박테스트',
        phone: '010-9876-5432',
        email: 'test@example.com',
        organization: '테스트회사',
        position: '매니저',
        is_founder: false,
        is_pitching: false,
        privacy_agreed: true,
        created_at: new Date().toISOString()
      }
    ];

    // 이름과 이메일이 정확히 일치하는 참가자 찾기
    const participant = mockData.find(item =>
      item.name.toLowerCase() === name.toLowerCase() &&
      item.email.toLowerCase() === email.toLowerCase()
    );

    if (participant) {
      console.log('✅ 참가자 인증 성공 (개발 모드)');
      return participant;
    } else {
      console.log('❌ 참가자 정보를 찾을 수 없습니다 (개발 모드)');
      return null;
    }
  }

  // Supabase에서 참가자 검색
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .ilike('name', name)
    .ilike('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('❌ 참가자 정보를 찾을 수 없습니다');
      return null;
    }
    console.error('❌ 인증 오류:', error);
    throw error;
  }

  console.log('✅ 참가자 인증 성공');
  return data as RegistrationData;
}

// ==================== 참가자 프로필 기능 ====================

// 참가자 프로필 타입 정의
export interface Profile {
  id: string
  user_id?: string
  email: string
  name: string
  avatar_url?: string
  bio?: string
  role?: string
  company?: string
  position?: string
  interests?: string[]
  hashtags?: string[]
  phone?: string
  website?: string
  linkedin_url?: string
  github_url?: string
  twitter_url?: string
  is_visible: boolean
  created_at?: string
  updated_at?: string
}

// 좋아요 타입 정의
export interface Like {
  id: string
  liker_id: string
  liked_id: string
  created_at: string
}

// 채팅방 타입 정의
export interface ChatRoom {
  id: string
  participant1_id: string
  participant2_id: string
  created_at: string
  updated_at: string
}

// 메시지 타입 정의
export interface Message {
  id: string
  room_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
  updated_at?: string
}

// 프로필 생성
export const createProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // 데이터 정제: undefined 필드 제거, 빈 배열 처리
    const cleanedData = Object.entries(profileData).reduce((acc, [key, value]) => {
      if (value === undefined) return acc
      if (Array.isArray(value) && value.length === 0) return acc
      acc[key] = value
      return acc
    }, {} as any)

    console.log('📤 Supabase로 전송할 프로필 데이터:', cleanedData)

    const { data, error } = await supabase
      .from('profiles')
      .insert([cleanedData])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase 프로필 생성 오류:', error)
      throw error
    }

    console.log('✅ Supabase 프로필 생성 응답:', data)
    return data as Profile
  } catch (error) {
    // localStorage 폴백 (개발용)
    console.warn('Supabase 프로필 생성 실패, localStorage 사용:', error)

    const newProfile: Profile = {
      id: profileData.user_id, // user_id를 profile id로 사용
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile

    // localStorage에 저장
    const storageKey = 'profiles'
    const profiles = JSON.parse(localStorage.getItem(storageKey) || '[]')

    // 기존 프로필이 있으면 업데이트, 없으면 추가
    const existingIndex = profiles.findIndex((p: Profile) => p.id === newProfile.id)
    if (existingIndex >= 0) {
      profiles[existingIndex] = newProfile
    } else {
      profiles.push(newProfile)
    }

    localStorage.setItem(storageKey, JSON.stringify(profiles))
    return newProfile
  }
}

// 프로필 조회 (단일)
export const getProfile = async (profileId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // 프로필이 없음
        return null
      }
      throw error
    }
    return data as Profile
  } catch (error) {
    // localStorage 폴백
    console.warn('Supabase 프로필 조회 실패, localStorage 사용:', error)
    const storageKey = 'profiles'
    const profiles = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const profile = profiles.find((p: Profile) => p.id === profileId)
    return profile || null
  }
}

// user_id로 프로필 조회
export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // 프로필이 없음 - 정상 상황
        console.log('ℹ️ user_id로 프로필을 찾을 수 없습니다:', userId)
        return null
      }
      throw error
    }

    console.log('✅ user_id로 프로필 조회 성공:', data.name)
    return data as Profile
  } catch (error) {
    // localStorage 폴백
    console.warn('Supabase 프로필 조회 실패, localStorage 사용:', error)
    const storageKey = 'profiles'
    const profiles = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const profile = profiles.find((p: Profile) => p.user_id === userId)
    return profile || null
  }
}

// 현재 사용자 프로필 조회 (Supabase Auth 사용 시)
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  return getProfileByUserId(user.id)
}

// 프로필 업데이트
export const updateProfile = async (profileId: string, updates: Partial<Profile>) => {
  try {
    // 데이터 정제: undefined 필드 제거, 빈 배열 처리
    const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value === undefined) return acc
      if (Array.isArray(value) && value.length === 0) return acc
      acc[key] = value
      return acc
    }, {} as any)

    cleanedUpdates.updated_at = new Date().toISOString()

    console.log('📤 Supabase로 전송할 업데이트 데이터:', cleanedUpdates)

    const { data, error } = await supabase
      .from('profiles')
      .update(cleanedUpdates)
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase 프로필 업데이트 오류:', error)
      throw error
    }

    console.log('✅ Supabase 프로필 업데이트 응답:', data)
    return data as Profile
  } catch (error) {
    // localStorage 폴백
    console.warn('Supabase 프로필 업데이트 실패, localStorage 사용:', error)
    const storageKey = 'profiles'
    const profiles = JSON.parse(localStorage.getItem(storageKey) || '[]')

    const index = profiles.findIndex((p: Profile) => p.id === profileId)
    if (index >= 0) {
      profiles[index] = {
        ...profiles[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem(storageKey, JSON.stringify(profiles))
      return profiles[index]
    }

    throw new Error('프로필을 찾을 수 없습니다.')
  }
}

// 프로필 검색 및 필터링
export interface ProfileSearchParams {
  name?: string
  role?: string
  company?: string
  interests?: string[]
  hashtags?: string[]
}

export const searchProfiles = async (params: ProfileSearchParams): Promise<Profile[]> => {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('is_visible', true)

  if (params.name) {
    query = query.ilike('name', `%${params.name}%`)
  }

  if (params.role) {
    query = query.ilike('role', `%${params.role}%`)
  }

  if (params.company) {
    query = query.ilike('company', `%${params.company}%`)
  }

  if (params.interests && params.interests.length > 0) {
    query = query.contains('interests', params.interests)
  }

  if (params.hashtags && params.hashtags.length > 0) {
    query = query.contains('hashtags', params.hashtags)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Profile[]
}

// 모든 공개 프로필 조회
export const getAllProfiles = async (): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Profile[]
  } catch (error) {
    // localStorage 폴백
    console.warn('Supabase 프로필 목록 조회 실패, localStorage 사용:', error)
    const storageKey = 'profiles'
    const profiles = JSON.parse(localStorage.getItem(storageKey) || '[]') as Profile[]
    return profiles.filter((p: Profile) => p.is_visible)
  }
}

// ==================== 좋아요 기능 ====================

// 좋아요 추가
export const addLike = async (likerId: string, likedId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .insert([{ liker_id: likerId, liked_id: likedId }])
    .select()
    .single()

  if (error) throw error
  return data as Like
}

// 좋아요 취소
export const removeLike = async (likerId: string, likedId: string) => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('liker_id', likerId)
    .eq('liked_id', likedId)

  if (error) throw error
}

// 좋아요 여부 확인
export const checkLike = async (likerId: string, likedId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('liker_id', likerId)
    .eq('liked_id', likedId)
    .single()

  if (error) return false
  return !!data
}

// 특정 프로필의 좋아요 개수 조회
export const getLikeCount = async (profileId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('liked_id', profileId)

  if (error) return 0
  return count || 0
}

// 내가 좋아요한 프로필 목록
export const getMyLikes = async (likerId: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('likes')
    .select('liked_id')
    .eq('liker_id', likerId)

  if (error || !data || data.length === 0) return []

  const likedIds = data.map(like => like.liked_id)

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', likedIds)

  if (profileError) return []
  return profiles as Profile[]
}

// ==================== 채팅 기능 ====================

// 채팅방 생성 또는 조회
export const getOrCreateChatRoom = async (participant1Id: string, participant2Id: string): Promise<ChatRoom> => {
  // ID 정렬
  const [p1, p2] = [participant1Id, participant2Id].sort()

  try {
    // 기존 채팅방 찾기
    const { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('participant1_id', p1)
      .eq('participant2_id', p2)
      .single()

    if (existingRoom) {
      return existingRoom as ChatRoom
    }

    // 없으면 생성
    const { data: newRoom, error: createError } = await supabase
      .from('chat_rooms')
      .insert([{ participant1_id: p1, participant2_id: p2 }])
      .select()
      .single()

    if (createError) throw createError
    return newRoom as ChatRoom
  } catch (error) {
    // Supabase 실패 시 localStorage 사용
    console.warn('Supabase 채팅방 생성 실패, localStorage 사용:', error)

    const roomId = `${p1}-${p2}`
    const storageKey = 'chat_rooms'
    const rooms = JSON.parse(localStorage.getItem(storageKey) || '[]')

    const existingRoom = rooms.find((r: ChatRoom) =>
      r.participant1_id === p1 && r.participant2_id === p2
    )

    if (existingRoom) {
      return existingRoom
    }

    const newRoom: ChatRoom = {
      id: roomId,
      participant1_id: p1,
      participant2_id: p2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    rooms.push(newRoom)
    localStorage.setItem(storageKey, JSON.stringify(rooms))
    return newRoom
  }
}

// 내 채팅방 목록 조회
export const getMyChatRooms = async (profileId: string): Promise<ChatRoom[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .or(`participant1_id.eq.${profileId},participant2_id.eq.${profileId}`)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data as ChatRoom[]
  } catch (error) {
    // Supabase 실패 시 localStorage 사용
    console.warn('Supabase 채팅방 목록 조회 실패, localStorage 사용:', error)
    const storageKey = 'chat_rooms'
    const rooms = JSON.parse(localStorage.getItem(storageKey) || '[]') as ChatRoom[]
    return rooms.filter((r: ChatRoom) =>
      r.participant1_id === profileId || r.participant2_id === profileId
    )
  }
}

// 메시지 전송
export const sendMessage = async (roomId: string, senderId: string, content: string): Promise<Message> => {
  const messageData = {
    room_id: roomId,
    sender_id: senderId,
    content: content,
    is_read: false
  }

  console.log('📤 Supabase로 전송할 메시지 데이터:', messageData)

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase 메시지 전송 오류:', error)
      throw error
    }

    console.log('✅ Supabase 메시지 전송 응답:', data)

    // 채팅방의 updated_at 업데이트
    await supabase
      .from('chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', roomId)

    return data as Message
  } catch (error) {
    // Supabase 실패 시 localStorage 사용 (개발용)
    console.warn('Supabase 메시지 전송 실패, localStorage 사용:', error)

    const mockMessage: Message = {
      id: `mock-${Date.now()}`,
      room_id: roomId,
      sender_id: senderId,
      content: content,
      is_read: false,
      created_at: new Date().toISOString()
    }

    // localStorage에 저장
    const storageKey = `messages_${roomId}`
    const existingMessages = JSON.parse(localStorage.getItem(storageKey) || '[]')
    existingMessages.push(mockMessage)
    localStorage.setItem(storageKey, JSON.stringify(existingMessages))

    // 이벤트 발생 (같은 탭/창 내 실시간 업데이트용)
    window.dispatchEvent(new CustomEvent('new-message', { detail: mockMessage }))

    // storage 이벤트는 다른 탭/창에서 자동으로 발생함

    return mockMessage
  }
}

// 채팅방의 메시지 조회
export const getMessages = async (roomId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Message[]
  } catch (error) {
    // Supabase 실패 시 localStorage 사용
    console.warn('Supabase 메시지 조회 실패, localStorage 사용:', error)
    const storageKey = `messages_${roomId}`
    return JSON.parse(localStorage.getItem(storageKey) || '[]') as Message[]
  }
}

// 메시지 읽음 처리
export const markMessageAsRead = async (messageId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)

    if (error) throw error
  } catch (error) {
    console.warn('Supabase 메시지 읽음 처리 실패, localStorage 사용:', error)
    // localStorage에서 메시지 찾아서 업데이트
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('messages_'))

    for (const key of allKeys) {
      const messages = JSON.parse(localStorage.getItem(key) || '[]') as Message[]
      const updated = messages.map(m =>
        m.id === messageId ? { ...m, is_read: true } : m
      )
      localStorage.setItem(key, JSON.stringify(updated))
    }
  }
}

// 채팅방의 모든 안 읽은 메시지를 읽음 처리
export const markRoomMessagesAsRead = async (roomId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('room_id', roomId)
      .eq('is_read', false)
      .neq('sender_id', userId)

    if (error) throw error
  } catch (error) {
    console.warn('Supabase 채팅방 메시지 읽음 처리 실패, localStorage 사용:', error)
    // localStorage에서 해당 채팅방의 메시지 업데이트
    const storageKey = `messages_${roomId}`
    const messages = JSON.parse(localStorage.getItem(storageKey) || '[]') as Message[]

    const updated = messages.map(m =>
      m.sender_id !== userId ? { ...m, is_read: true } : m
    )
    localStorage.setItem(storageKey, JSON.stringify(updated))

    // 이벤트 발생하여 다른 컴포넌트에 알림
    window.dispatchEvent(new CustomEvent('messages-read', { detail: { roomId } }))
  }
}

// 읽지 않은 메시지 개수 (특정 채팅방)
export const getUnreadCount = async (roomId: string, userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId)
      .eq('is_read', false)
      .neq('sender_id', userId)

    if (error) throw error
    return count || 0
  } catch (error) {
    // localStorage 폴백
    console.warn('Supabase 안 읽은 메시지 조회 실패, localStorage 사용:', error)
    const storageKey = `messages_${roomId}`
    const messages = JSON.parse(localStorage.getItem(storageKey) || '[]') as Message[]
    return messages.filter(m => !m.is_read && m.sender_id !== userId).length
  }
}

// 전체 안 읽은 메시지 개수
export const getTotalUnreadCount = async (userId: string): Promise<number> => {
  try {
    // 내 채팅방 목록 가져오기
    const rooms = await getMyChatRooms(userId)

    // 각 채팅방의 안 읽은 메시지 수 합산
    let totalCount = 0
    for (const room of rooms) {
      const count = await getUnreadCount(room.id, userId)
      totalCount += count
    }

    return totalCount
  } catch (error) {
    console.error('전체 안 읽은 메시지 조회 실패:', error)
    return 0
  }
}

// 실시간 메시지 구독
export const subscribeToMessages = (roomId: string, callback: (message: Message) => void) => {
  return supabase
    .channel(`messages:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()
}

// ==================== 아바타 업로드 ====================

// 아바타 이미지 업로드
export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (error) {
    // localStorage 폴백: 이미지를 base64로 변환하여 저장
    console.warn('Supabase 이미지 업로드 실패, base64 변환 사용:', error)

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        resolve(base64String)
      }
      reader.onerror = () => {
        reject(new Error('이미지 파일을 읽을 수 없습니다.'))
      }
      reader.readAsDataURL(file)
    })
  }
}
