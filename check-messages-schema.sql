-- =====================================================
-- 메시지 테이블 구조 확인 및 수정
-- =====================================================

-- 1. 현재 messages 테이블 구조 확인
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;

-- 2. messages 테이블의 제약 조건 확인
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'messages';

-- 3. 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- 5. RLS 정책 확인
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
WHERE tablename = 'messages';

-- 6. 테스트: 메시지 삽입 시도
-- 아래 쿼리를 실행하여 메시지가 삽입되는지 확인
-- (실제 room_id와 sender_id는 수정 필요)

/*
INSERT INTO messages (room_id, sender_id, content, is_read)
VALUES (
    'your-room-id-here',  -- 실제 채팅방 ID로 교체
    'your-sender-id-here', -- 실제 sender ID로 교체
    '테스트 메시지',
    false
)
RETURNING *;
*/

-- 7. chat_rooms 테이블 확인
SELECT * FROM chat_rooms LIMIT 5;

-- 8. messages 테이블 확인
SELECT * FROM messages LIMIT 10;
