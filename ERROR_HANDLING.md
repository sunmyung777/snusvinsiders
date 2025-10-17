# 오류 처리 가이드

## PGRST116 오류

### 오류 정보
```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "Cannot coerce the result to a single JSON object"
}
```

**의미**: Supabase에서 `.single()`을 사용했는데 결과가 0개입니다.

### 발생 상황별 처리

#### 1. 로그인 시 (verifyParticipant)
```typescript
// 상황: registrations 테이블에 해당 이름/이메일이 없음
// 처리: null 반환 → "행사에 등록되지 않은 정보입니다" 메시지
```

**사용자 메시지**:
```
행사에 등록되지 않은 정보입니다. 이름과 이메일을 확인해주세요.
```

**해결 방법**:
- registrations 테이블에 데이터 추가
- 이름/이메일 정확히 입력

#### 2. 프로필 로드 시 (loadParticipantProfile)
```typescript
// 상황: 프로필이 아직 생성되지 않음 (정상)
// 처리: profile = null → 프로필 등록 페이지로 이동
```

**콘솔 로그**:
```
ℹ️ 프로필이 아직 생성되지 않았습니다.
```

**사용자 경험**:
- 로그인 성공 → 프로필 등록 페이지로 자동 이동
- 정상적인 플로우

#### 3. 프로필 조회 시 (getProfile)
```typescript
// 상황: 특정 ID의 프로필이 없음
// 처리: null 반환
```

**사용자 메시지**:
```
(없음 - 조용히 null 처리)
```

### 처리 원칙

✅ **정상적인 상황** (PGRST116이 예상됨):
- 프로필 첫 로드: 프로필이 없는 것이 정상
- → 조용히 null 처리, 로그만 출력

❌ **비정상적인 상황** (PGRST116이 예상되지 않음):
- 로그인: 등록된 참가자여야 함
- → 사용자에게 에러 메시지 표시

## Foreign Key 오류 (23503)

### 오류 정보
```json
{
  "code": "23503",
  "details": "Key is not present in table \"users\".",
  "message": "violates foreign key constraint \"profiles_user_id_fkey\""
}
```

**원인**: `profiles.user_id`가 `auth.users`를 참조하는데 해당 사용자가 없음

**해결**:
```sql
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
```

참고: [fix-foreign-key.sql](fix-foreign-key.sql)

## Unauthorized 오류

### 오류 정보
```
new row violates row-level security policy
```

**원인**: RLS 정책이 설정되지 않아 익명 사용자가 접근 불가

**해결**:
```sql
-- supabase-rls-policies.sql 실행
```

## Duplicate Key 오류 (23505)

### 오류 정보
```json
{
  "code": "23505",
  "details": "Key (user_id)=(dev-1) already exists.",
  "message": "duplicate key value violates unique constraint \"profiles_user_id_key\""
}
```

**원인**: 같은 `user_id`로 프로필을 두 번 생성하려고 함

**문제 상황**:
- 프로필 수정 버튼을 눌렀는데 새로 생성하려고 함
- `profile?.id` 체크만으로는 불충분 (localStorage와 Supabase ID 불일치)

**해결 방법** (이미 적용됨):

1. **user_id로 기존 프로필 확인** (`getProfileByUserId`)
2. 있으면 `updateProfile` 사용
3. 없으면 `createProfile` 사용

**수정된 코드**:
```typescript
// ✅ 올바른 방법
const existingProfile = await getProfileByUserId(user.id)

if (existingProfile) {
  await updateProfile(existingProfile.id, updates)
} else {
  await createProfile({user_id: user.id, ...updates})
}
```

**이전 코드 (문제)**:
```typescript
// ❌ 문제: profile.id가 없거나 잘못된 경우
if (profile?.id) {
  await updateProfile(profile.id, updates)
} else {
  await createProfile({...}) // 중복 생성!
}
```

## 네트워크 오류

### 오류 정보
```
Failed to fetch
TypeError: NetworkError
```

**원인**:
- 인터넷 연결 끊김
- Supabase 서버 다운
- CORS 문제

**처리**:
```typescript
try {
  await supabase.from('profiles').select()
} catch (error) {
  // localStorage 폴백으로 자동 전환
  console.warn('Supabase 연결 실패, localStorage 사용')
}
```

## 콘솔 로그 해석

### 정상 플로우

#### 로그인:
```
🔐 참가자 인증 시도: 이름="김개발", 이메일="dev@example.com"
✅ 참가자 인증 성공
ℹ️ 프로필이 아직 생성되지 않았습니다.
```

#### 프로필 생성:
```
✨ 새 프로필 생성 중...
📤 Supabase로 전송할 프로필 데이터: {user_id: "dev-1", ...}
✅ Supabase 프로필 생성 응답: {id: "abc123", ...}
✅ 프로필 생성 성공: abc123
✅ 프로필 로드 성공: 김개발
```

#### 프로필 업데이트:
```
📝 프로필 업데이트 중... abc123
📤 Supabase로 전송할 업데이트 데이터: {name: "김개발", ...}
✅ Supabase 프로필 업데이트 응답: {id: "abc123", ...}
✅ 프로필 업데이트 성공
```

### 오류 플로우

#### 로그인 실패:
```
🔐 참가자 인증 시도: 이름="홍길동", 이메일="hong@test.com"
❌ 참가자 정보를 찾을 수 없습니다
```

#### Foreign Key 오류:
```
✨ 새 프로필 생성 중...
📤 Supabase로 전송할 프로필 데이터: {user_id: "dev-1", ...}
❌ Supabase 프로필 생성 오류: {code: "23503", message: "..."}
⚠️ Supabase 프로필 생성 실패, localStorage 사용
```

#### RLS 정책 오류:
```
📤 Supabase로 전송할 프로필 데이터: {user_id: "dev-1", ...}
❌ Supabase 프로필 생성 오류: {message: "new row violates row-level security policy"}
⚠️ Supabase 프로필 생성 실패, localStorage 사용
```

## 디버깅 체크리스트

문제 발생 시 순서대로 확인:

1. **브라우저 콘솔 로그 확인**
   - 어떤 아이콘이 표시되는가? (✅ ❌ ⚠️ ℹ️)
   - 어느 단계에서 실패했는가?

2. **네트워크 탭 확인**
   - Supabase API 호출이 있는가?
   - 응답 상태 코드는? (200, 400, 500)
   - 응답 body는?

3. **Supabase Dashboard 확인**
   - registrations 테이블에 데이터가 있는가?
   - profiles 테이블 구조가 올바른가?
   - RLS 정책이 설정되었는가?

4. **localStorage 확인**
   - Application > Local Storage
   - `participant`, `profiles` 키 확인

5. **환경 변수 확인**
   - `.env` 파일에 올바른 Supabase URL/Key

## 메시지 저장 안 되는 문제

### 증상
- 채팅방(chat_room)은 생성되지만 메시지(messages)가 Supabase에 저장되지 않음
- localStorage에만 저장되고 다른 기기에서 보이지 않음

### 확인 방법
브라우저 콘솔에서 다음 로그를 확인:
```
📤 Supabase로 전송할 메시지 데이터: {...}
❌ Supabase 메시지 전송 오류: {message: "new row violates row-level security policy"}
⚠️ Supabase 메시지 전송 실패, localStorage 사용
```

### 원인
messages 테이블에 RLS 정책이 설정되지 않아 익명 사용자가 INSERT할 수 없음

### 해결 방법
1. Supabase Dashboard > SQL Editor 열기
2. `supabase-rls-policies.sql` 파일 내용 전체 복사
3. SQL Editor에 붙여넣고 실행
4. 특히 이 부분이 중요:
```sql
-- messages 테이블 RLS 정책
CREATE POLICY "messages_insert_policy"
ON messages FOR INSERT
TO anon
WITH CHECK (true);
```

### 테스트
메시지 전송 후 콘솔에서:
```
✅ Supabase 메시지 전송 응답: {id: "...", content: "...", ...}
```

## 빠른 해결 가이드

| 오류 코드 | 문제 | 해결 |
|----------|------|------|
| PGRST116 | 데이터 없음 | 정상 (로그인 실패 또는 프로필 미생성) |
| 23503 | Foreign Key | `fix-foreign-key.sql` 실행 |
| 23505 | Duplicate | 기존 프로필 확인 후 업데이트 |
| RLS 오류 | 권한 없음 | `supabase-rls-policies.sql` 실행 |
| 메시지 안 저장됨 | messages RLS 없음 | `supabase-rls-policies.sql` 실행 |
| NetworkError | 연결 실패 | localStorage 폴백 자동 작동 |

## 프로덕션 모니터링

중요한 로그 패턴:

- `❌` = 실제 오류 (조사 필요)
- `⚠️` = 폴백 작동 (Supabase → localStorage)
- `ℹ️` = 정보성 (정상)
- `✅` = 성공

**알림 설정 권장**:
- `❌` 로그가 연속 발생 → Supabase 연결 확인
- `⚠️` 로그가 지속 → RLS/FK 정책 확인
