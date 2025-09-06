-- NextRise 2025 완전한 데이터베이스 설정 스크립트
-- registrations 테이블 + 스토리지 + 모든 정책 설정

-- ========================================
-- 1. REGISTRATIONS 테이블 설정
-- ========================================

-- 기존 테이블 삭제 (CASCADE로 모든 관련 객체 삭제)
DROP TABLE IF EXISTS registrations CASCADE;

-- registrations 테이블 생성
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  is_founder BOOLEAN DEFAULT FALSE,
  company_name VARCHAR(255),
  is_pitching BOOLEAN DEFAULT FALSE,
  pitch_file_url TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
CREATE POLICY "Enable insert for anon users" ON registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users" ON registrations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON registrations
  FOR SELECT TO authenticated USING (true);

-- 인덱스 생성
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_is_founder ON registrations(is_founder);
CREATE INDEX idx_registrations_is_pitching ON registrations(is_pitching);

-- ========================================
-- 2. 트리거 함수 및 트리거 설정
-- ========================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 3. 스토리지 버킷 설정
-- ========================================

-- pitch-files 버킷 생성 (이미 존재하면 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pitch-files', 'pitch-files', true)
ON CONFLICT (id) DO NOTHING;

-- 기존 스토리지 정책 삭제 (혹시 있다면)
DROP POLICY IF EXISTS "Enable upload for anon users" ON storage.objects;
DROP POLICY IF EXISTS "Enable upload for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable view for anon users" ON storage.objects;
DROP POLICY IF EXISTS "Enable view for authenticated users" ON storage.objects;

-- 새로운 스토리지 정책 생성
CREATE POLICY "Enable upload for anon users" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'pitch-files');

CREATE POLICY "Enable upload for authenticated users" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pitch-files');

CREATE POLICY "Enable view for anon users" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'pitch-files');

CREATE POLICY "Enable view for authenticated users" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'pitch-files');

-- ========================================
-- 4. 설정 확인 및 테스트
-- ========================================

-- 테이블 구조 확인
SELECT 'registrations 테이블 구조:' as info;
-- 테이블 구조 확인을 위한 쿼리
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'registrations'
ORDER BY ordinal_position;

-- RLS 정책 확인
SELECT 'registrations 테이블 RLS 정책:' as info;
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'registrations'
ORDER BY policyname;

-- 스토리지 버킷 확인
SELECT 'pitch-files 버킷 상태:' as info;
SELECT id, name, public FROM storage.buckets WHERE id = 'pitch-files';

-- 스토리지 정책 확인
SELECT 'storage.objects 정책:' as info;
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%pitch-files%'
ORDER BY policyname;

-- ========================================
-- 5. 완료 메시지
-- ========================================

SELECT '🎉 NextRise 2025 데이터베이스 설정이 완료되었습니다!' as message;
SELECT '✅ registrations 테이블 생성 완료' as status;
SELECT '✅ RLS 정책 설정 완료 (anon 사용자 INSERT 허용)' as rls_status;
SELECT '✅ pitch-files 스토리지 버킷 설정 완료' as storage_status;
SELECT '✅ 인덱스 및 트리거 설정 완료' as optimization_status;

-- 테스트용 샘플 데이터 삽입 (선택사항)
-- INSERT INTO registrations (name, phone, email, organization, position, privacy_agreed)
-- VALUES ('테스트 사용자', '010-1234-5678', 'test@example.com', '테스트 회사', '개발자', true);
