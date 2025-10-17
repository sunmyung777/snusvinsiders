-- =====================================================
-- Supabase RLS 정책 설정
-- =====================================================
-- 이 파일은 Supabase Auth를 사용하지 않고도 익명 사용자가
-- 데이터를 읽고 쓸 수 있도록 RLS 정책을 설정합니다.

-- ==================== 1. registrations 테이블 ====================

-- RLS 활성화
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "registrations_select_policy"
ON registrations FOR SELECT
TO anon
USING (true);

-- 모든 사용자가 삽입 가능 (행사 등록용)
CREATE POLICY "registrations_insert_policy"
ON registrations FOR INSERT
TO anon
WITH CHECK (true);

-- ==================== 2. profiles 테이블 ====================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 공개 프로필 읽기 가능
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
TO anon
USING (is_visible = true);

-- 모든 사용자가 프로필 생성 가능
CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
TO anon
WITH CHECK (true);

-- 모든 사용자가 자신의 프로필 업데이트 가능 (user_id 기반)
-- 참고: Supabase Auth를 사용하지 않으므로 모든 업데이트 허용
CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- ==================== 3. likes 테이블 ====================

-- RLS 활성화
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 좋아요 정보 읽기 가능
CREATE POLICY "likes_select_policy"
ON likes FOR SELECT
TO anon
USING (true);

-- 모든 사용자가 좋아요 추가 가능
CREATE POLICY "likes_insert_policy"
ON likes FOR INSERT
TO anon
WITH CHECK (true);

-- 모든 사용자가 좋아요 삭제 가능
CREATE POLICY "likes_delete_policy"
ON likes FOR DELETE
TO anon
USING (true);

-- ==================== 4. chat_rooms 테이블 ====================

-- RLS 활성화
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 채팅방 정보 읽기 가능
CREATE POLICY "chat_rooms_select_policy"
ON chat_rooms FOR SELECT
TO anon
USING (true);

-- 모든 사용자가 채팅방 생성 가능
CREATE POLICY "chat_rooms_insert_policy"
ON chat_rooms FOR INSERT
TO anon
WITH CHECK (true);

-- 모든 사용자가 채팅방 업데이트 가능 (updated_at 갱신용)
CREATE POLICY "chat_rooms_update_policy"
ON chat_rooms FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- ==================== 5. messages 테이블 ====================

-- RLS 활성화
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 메시지 읽기 가능
CREATE POLICY "messages_select_policy"
ON messages FOR SELECT
TO anon
USING (true);

-- 모든 사용자가 메시지 전송 가능
CREATE POLICY "messages_insert_policy"
ON messages FOR INSERT
TO anon
WITH CHECK (true);

-- 모든 사용자가 메시지 업데이트 가능 (읽음 상태 변경용)
CREATE POLICY "messages_update_policy"
ON messages FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- ==================== 6. Storage 버킷 (avatars) ====================

-- avatars 버킷 생성 (이미 있으면 무시됨)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책: 모든 사용자가 파일 업로드 가능
CREATE POLICY "avatars_insert_policy"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'avatars');

-- Storage 정책: 모든 사용자가 파일 읽기 가능
CREATE POLICY "avatars_select_policy"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'avatars');

-- Storage 정책: 모든 사용자가 파일 업데이트 가능
CREATE POLICY "avatars_update_policy"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Storage 정책: 모든 사용자가 파일 삭제 가능
CREATE POLICY "avatars_delete_policy"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'avatars');

-- =====================================================
-- 완료!
-- =====================================================
-- 이제 Supabase Auth 없이도 모든 기능이 작동합니다.
--
-- 주의사항:
-- - 이 설정은 개발/데모 환경에 적합합니다.
-- - 프로덕션에서는 보안을 위해 더 엄격한 정책이 필요합니다.
-- - 예: user_id 검증, 요청 횟수 제한 등
