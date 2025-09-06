-- NextRise 2025 참가신청 테이블 생성

-- 1. registrations 테이블 생성
CREATE TABLE IF NOT EXISTS registrations (
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

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 3. 정책 생성 (익명 사용자도 삽입 가능, 읽기는 관리자만)
CREATE POLICY "Enable insert for anon users" ON registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users" ON registrations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON registrations
  FOR SELECT TO authenticated USING (true);

-- 4. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_registrations_is_founder ON registrations(is_founder);
CREATE INDEX IF NOT EXISTS idx_registrations_is_pitching ON registrations(is_pitching);

-- 5. 스토리지 버킷 생성 (pitch-files)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pitch-files', 'pitch-files', true)
ON CONFLICT (id) DO NOTHING;

-- 6. 스토리지 정책 생성
CREATE POLICY "Enable upload for anon users" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'pitch-files');

CREATE POLICY "Enable upload for authenticated users" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pitch-files');

CREATE POLICY "Enable view for anon users" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'pitch-files');

CREATE POLICY "Enable view for authenticated users" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'pitch-files');

-- 7. 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. 트리거 생성
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 완료 메시지
SELECT 'NextRise 2025 데이터베이스 설정이 완료되었습니다!' as message;
