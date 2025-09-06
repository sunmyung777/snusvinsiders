-- NextRise 2025 registrations 테이블 재생성 스크립트
-- 기존 테이블이 삭제된 후 완전히 새로 생성

-- 1. 기존 테이블 및 관련 정책 완전 삭제 (혹시 남아있다면)
DROP TABLE IF EXISTS registrations CASCADE;

-- 2. registrations 테이블 생성
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

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 생성 (anon 사용자도 INSERT 가능)
CREATE POLICY "Enable insert for anon users" ON registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users" ON registrations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON registrations
  FOR SELECT TO authenticated USING (true);

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_is_founder ON registrations(is_founder);
CREATE INDEX idx_registrations_is_pitching ON registrations(is_pitching);

-- 6. 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 트리거 생성
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. 테이블 구조 확인
\d registrations;

-- 9. RLS 정책 확인
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'registrations'
ORDER BY policyname;

-- 완료 메시지
SELECT 'registrations 테이블이 성공적으로 재생성되었습니다!' as message;
SELECT 'RLS 정책이 anon 사용자 INSERT를 허용하도록 설정되었습니다.' as rls_status;
