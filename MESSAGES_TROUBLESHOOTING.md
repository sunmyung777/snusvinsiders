# 메시지 저장 문제 해결 가이드

## 문제 증상

메시지를 전송하면:
- ✅ 채팅방(chat_rooms)은 생성됨
- ❌ 메시지(messages)는 Supabase에 저장되지 않음
- ⚠️ localStorage에만 저장되어 다른 기기/탭에서 보이지 않음

## 진단 방법

### 1단계: 브라우저 콘솔 확인

메시지 전송 후 콘솔에서 다음 로그를 확인하세요:

**정상 작동 시:**
```
📤 Supabase로 전송할 메시지 데이터: {
  room_id: "...",
  sender_id: "...",
  content: "안녕하세요",
  is_read: false
}
✅ Supabase 메시지 전송 응답: {
  id: "uuid-...",
  room_id: "...",
  sender_id: "...",
  content: "안녕하세요",
  is_read: false,
  created_at: "2025-01-15T..."
}
```

**RLS 정책 오류 시:**
```
📤 Supabase로 전송할 메시지 데이터: {...}
❌ Supabase 메시지 전송 오류: {
  code: "42501",
  message: "new row violates row-level security policy for table \"messages\""
}
⚠️ Supabase 메시지 전송 실패, localStorage 사용: Error...
```

**Foreign Key 오류 시:**
```
❌ Supabase 메시지 전송 오류: {
  code: "23503",
  message: "violates foreign key constraint \"messages_room_id_fkey\"",
  details: "Key (room_id)=(...) is not present in table \"chat_rooms\"."
}
```

### 2단계: Supabase Dashboard 확인

1. Supabase Dashboard > Table Editor 열기
2. `messages` 테이블 선택
3. 데이터가 있는지 확인
4. 없으면 RLS 정책 문제

### 3단계: RLS 정책 확인

Supabase Dashboard > SQL Editor에서 실행:

```sql
-- messages 테이블의 RLS 정책 확인
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'messages';
```

**예상 결과:**
| policyname | roles | cmd |
|-----------|-------|-----|
| messages_select_policy | anon | SELECT |
| messages_insert_policy | anon | INSERT |
| messages_update_policy | anon | UPDATE |

정책이 없거나 부족하면 → **해결 방법** 참고

## 해결 방법

### 방법 1: RLS 정책 파일 전체 실행 (권장)

1. 프로젝트 루트의 `supabase-rls-policies.sql` 파일 열기
2. 내용 전체 복사
3. Supabase Dashboard > SQL Editor에 붙여넣기
4. **Run** 버튼 클릭
5. 완료 후 메시지 다시 전송

### 방법 2: messages 테이블만 수동 설정

Supabase Dashboard > SQL Editor에서 실행:

```sql
-- RLS 활성화
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 읽기 정책
CREATE POLICY "messages_select_policy"
ON messages FOR SELECT
TO anon
USING (true);

-- 쓰기 정책 (메시지 전송용)
CREATE POLICY "messages_insert_policy"
ON messages FOR INSERT
TO anon
WITH CHECK (true);

-- 업데이트 정책 (읽음 상태 변경용)
CREATE POLICY "messages_update_policy"
ON messages FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
```

## 테스트

### 1. 메시지 전송 테스트

1. 앱에서 채팅방 열기
2. 메시지 전송
3. 브라우저 콘솔에서 `✅ Supabase 메시지 전송 응답` 확인

### 2. Supabase Dashboard 확인

1. Table Editor > messages
2. 방금 전송한 메시지가 보이는지 확인
3. `created_at` 타임스탬프가 최신인지 확인

### 3. 다른 기기/탭에서 확인

1. 다른 브라우저나 시크릿 모드로 로그인
2. 같은 채팅방 열기
3. 메시지가 보이는지 확인

## 자주 묻는 질문

### Q: chat_rooms는 생성되는데 왜 messages만 안 되나요?

A: chat_rooms 테이블에는 RLS 정책이 설정되어 있지만, messages 테이블에는 없어서 그렇습니다. `supabase-rls-policies.sql`을 실행하면 모든 테이블의 정책이 설정됩니다.

### Q: localStorage에는 저장되는데 왜 Supabase에는 안 되나요?

A: 코드에 localStorage 폴백 로직이 있어서, Supabase 실패 시 자동으로 localStorage를 사용합니다. 이는 개발 중에 유용하지만, 실제로는 Supabase에 저장되어야 다른 사용자가 볼 수 있습니다.

### Q: RLS 정책을 설정했는데도 안 되면?

A: 다음을 확인하세요:
1. messages 테이블에 foreign key 제약 조건이 있는지 확인
   ```sql
   SELECT
       tc.constraint_name,
       tc.constraint_type,
       kcu.column_name
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
       ON tc.constraint_name = kcu.constraint_name
   WHERE tc.table_name = 'messages';
   ```

2. room_id가 유효한지 확인 (chat_rooms 테이블에 존재하는지)
   ```sql
   SELECT * FROM chat_rooms WHERE id = 'your-room-id';
   ```

3. 환경 변수(.env) 확인
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

### Q: 프로덕션에서도 이렇게 사용하나요?

A: 이 설정은 개발/데모 환경에 적합합니다. 프로덕션에서는 더 엄격한 정책이 필요합니다:
- 특정 사용자만 자신의 메시지 수정 가능
- 요청 횟수 제한 (rate limiting)
- 메시지 크기 제한
- 악성 콘텐츠 필터링

## 도움이 더 필요하면

1. 브라우저 콘솔의 전체 로그 캡처
2. Supabase Dashboard > Logs에서 에러 확인
3. `check-messages-schema.sql` 실행하여 테이블 구조 확인
4. `ERROR_HANDLING.md` 참고

## 체크리스트

메시지가 저장되지 않을 때 순서대로 확인:

- [ ] `supabase-rls-policies.sql` 파일이 실행되었는가?
- [ ] messages 테이블에 RLS 정책이 3개 있는가? (SELECT, INSERT, UPDATE)
- [ ] 브라우저 콘솔에 `❌ Supabase 메시지 전송 오류` 로그가 있는가?
- [ ] Supabase Dashboard에서 messages 테이블에 데이터가 보이는가?
- [ ] .env 파일에 올바른 Supabase URL과 Key가 있는가?
- [ ] chat_rooms 테이블에 채팅방이 생성되었는가?
- [ ] 네트워크 탭에서 POST /rest/v1/messages 요청이 보이는가?
