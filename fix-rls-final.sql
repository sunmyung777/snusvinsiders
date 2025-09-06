-- RLS 정책 완전 수정 스크립트
-- anon 사용자 INSERT 문제 해결

-- ========================================
-- 1. 모든 기존 정책 완전 삭제
-- ========================================

-- registrations 테이블의 모든 정책 삭제
DROP POLICY IF EXISTS "Enable insert for anon users" ON registrations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON registrations;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON registrations;

-- 혹시 남아있을 수 있는 다른 정책들도 삭제
DROP POLICY IF EXISTS "Anyone can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Only authenticated users can view registrations" ON registrations;

-- ========================================
-- 2. RLS 비활성화 후 재활성화
-- ========================================

-- RLS 완전히 비활성화
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- RLS 다시 활성화
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. 새로운 RLS 정책 생성 (더 명확한 방식)
-- ========================================

-- anon 사용자를 위한 INSERT 정책 (가장 관대한 설정)
CREATE POLICY "allow_anon_insert" ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- authenticated 사용자를 위한 INSERT 정책
CREATE POLICY "allow_authenticated_insert" ON registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- authenticated 사용자를 위한 SELECT 정책
CREATE POLICY "allow_authenticated_select" ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- ========================================
-- 4. 정책 확인
-- ========================================

-- 현재 활성화된 정책 확인
SELECT 'RLS 정책 확인:' as info;
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'registrations'
ORDER BY policyname;

-- RLS 상태 확인
SELECT 'RLS 상태 확인:' as info;
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'registrations';

-- ========================================
-- 5. 테스트 INSERT (선택사항)
-- ========================================

-- 테스트용 데이터 삽입 시도 (주석 해제해서 테스트)
-- INSERT INTO registrations (
--     name,
--     phone,
--     email,
--     organization,
--     position,
--     privacy_agreed
-- ) VALUES (
--     '테스트 사용자',
--     '010-1234-5678',
--     'test@example.com',
--     '테스트 회사',
--     '개발자',
--     true
-- );

-- ========================================
-- 6. 완료 메시지
-- ========================================

SELECT '🔧 RLS 정책이 수정되었습니다!' as message;
SELECT '✅ anon 사용자 INSERT 허용 정책 적용' as status;
SELECT '⚠️  이제 참가신청 폼을 다시 테스트해보세요' as next_step;
