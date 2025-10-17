-- =====================================================
-- Foreign Key 제약 조건 제거
-- =====================================================

-- 문제: profiles 테이블의 user_id가 auth.users를 참조하고 있음
-- 해결: foreign key 제약 조건 제거

-- 1. 기존 foreign key 제약 조건 확인 및 제거
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- 2. user_id 컬럼을 독립적인 TEXT 컬럼으로 유지
-- (이미 TEXT 타입이므로 별도 작업 불필요)

-- 3. user_id에 인덱스가 있는지 확인 (성능을 위해)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 4. 테스트: 프로필 생성 테스트 데이터
-- 참고: 실제 앱에서 프로필을 생성하기 전에 이 제약 조건이 제거되어야 함

-- 완료!
-- 이제 Supabase Auth 없이도 profiles 테이블에 데이터를 삽입할 수 있습니다.
