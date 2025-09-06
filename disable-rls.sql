-- RLS 완전 비활성화 스크립트
-- 개발/테스트 환경에서 사용 (프로덕션에서는 권장하지 않음)

-- ========================================
-- 1. registrations 테이블 RLS 비활성화
-- ========================================

-- 모든 정책 삭제
DROP POLICY IF EXISTS "allow_anon_insert" ON registrations;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON registrations;
DROP POLICY IF EXISTS "allow_authenticated_select" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon users" ON registrations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON registrations;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON registrations;

-- RLS 완전 비활성화
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. 확인
-- ========================================

-- RLS 상태 확인
SELECT 'RLS 비활성화 확인:' as info;
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'registrations';

-- 남아있는 정책 확인 (없어야 함)
SELECT 'RLS 정책 확인 (비어있어야 함):' as info;
SELECT
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE tablename = 'registrations';

-- ========================================
-- 3. 테스트 INSERT
-- ========================================

-- 테스트용 데이터 삽입 (이제 성공해야 함)
INSERT INTO registrations (
    name,
    phone,
    email,
    organization,
    position,
    privacy_agreed
) VALUES (
    'RLS 테스트 사용자',
    '010-9999-9999',
    'rls-test@example.com',
    'RLS 테스트 회사',
    'RLS 테스터',
    true
);

-- 삽입된 데이터 확인
SELECT 'RLS 비활성화 후 테스트 데이터:' as info;
SELECT id, name, email, organization, created_at
FROM registrations
WHERE email = 'rls-test@example.com';

-- ========================================
-- 4. 완료 메시지
-- ========================================

SELECT '🚫 RLS가 완전히 비활성화되었습니다!' as message;
SELECT '✅ 이제 모든 사용자가 자유롭게 INSERT/SELECT 가능' as status;
SELECT '⚠️  보안이 낮아졌으니 프로덕션에서는 RLS 재활성화 권장' as warning;
