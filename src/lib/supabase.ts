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
  const { data, error } = await supabase.storage
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
