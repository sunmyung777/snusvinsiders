# 프로필 데이터 검증 가이드

## Supabase로 전송되는 프로필 데이터 구조

### 1. 프로필 생성 시 (createProfile)

**전송 데이터 예시:**
```json
{
  "user_id": "dev-1",
  "email": "dev@example.com",
  "name": "홍길동",
  "bio": "10년차 개발자입니다.",
  "role": "개발자",
  "company": "테크회사",
  "position": "시니어 개발자",
  "phone": "010-1234-5678",
  "interests": ["AI", "블록체인", "웹3.0"],
  "hashtags": ["창업", "투자"],
  "is_visible": true,
  "avatar_url": "https://... 또는 base64..."
}
```

**필수 필드:**
- `user_id` (TEXT, UNIQUE) - RegistrationData의 id
- `email` (TEXT)
- `name` (TEXT)
- `is_visible` (BOOLEAN)

**선택 필드:**
- `bio`, `role`, `company`, `position`, `phone`
- `avatar_url`, `website`, `linkedin_url`, `github_url`, `twitter_url`
- `interests` (TEXT[]) - 문자열 배열
- `hashtags` (TEXT[]) - 문자열 배열

### 2. 프로필 업데이트 시 (updateProfile)

**전송 데이터 예시:**
```json
{
  "name": "홍길동",
  "bio": "업데이트된 소개",
  "interests": ["AI", "스타트업"],
  "updated_at": "2025-01-15T12:00:00.000Z"
}
```

**자동 추가 필드:**
- `updated_at` (TIMESTAMPTZ) - 자동으로 현재 시간 설정

### 3. Supabase 응답 구조

**성공 응답:**
```json
{
  "id": "uuid-generated-by-supabase",
  "user_id": "dev-1",
  "email": "dev@example.com",
  "name": "홍길동",
  "bio": "10년차 개발자입니다.",
  "role": "개발자",
  "company": "테크회사",
  "position": "시니어 개발자",
  "phone": "010-1234-5678",
  "avatar_url": "https://...",
  "website": null,
  "linkedin_url": null,
  "github_url": null,
  "twitter_url": null,
  "interests": ["AI", "블록체인", "웹3.0"],
  "hashtags": ["창업", "투자"],
  "is_visible": true,
  "created_at": "2025-01-15T12:00:00.000Z",
  "updated_at": "2025-01-15T12:00:00.000Z"
}
```

**에러 응답:**
```json
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint \"profiles_user_id_key\"",
  "details": "Key (user_id)=(dev-1) already exists."
}
```

## 데이터 정제 (Cleaning)

코드에서 자동으로 다음을 처리합니다:

### 1. undefined 필드 제거
```typescript
// Before
{ name: "홍길동", bio: undefined, role: undefined }

// After (Supabase로 전송)
{ name: "홍길동" }
```

### 2. 빈 배열 제거
```typescript
// Before
{ interests: [], hashtags: ["창업"] }

// After (Supabase로 전송)
{ hashtags: ["창업"] }
```

이유: Supabase에서 빈 배열을 NULL로 저장하는 것보다 필드를 생략하는 것이 더 깔끔함

## 디버깅

브라우저 콘솔에서 다음 로그를 확인하세요:

### 프로필 생성 시:
```
📤 Supabase로 전송할 프로필 데이터: { user_id: "dev-1", email: "...", ... }
✅ Supabase 프로필 생성 응답: { id: "...", ... }
```

또는 에러 시:
```
❌ Supabase 프로필 생성 오류: { code: "...", message: "..." }
⚠️ Supabase 프로필 생성 실패, localStorage 사용: Error...
```

### 프로필 업데이트 시:
```
📤 Supabase로 전송할 업데이트 데이터: { name: "...", updated_at: "..." }
✅ Supabase 프로필 업데이트 응답: { id: "...", ... }
```

## 일반적인 문제와 해결책

### 1. "duplicate key value" 오류
**원인**: 같은 `user_id`로 프로필을 두 번 생성하려고 함

**해결**:
- 프로필이 이미 있는지 확인 후 업데이트 사용
- AuthContext의 `refreshProfile()`로 기존 프로필 확인

### 2. "violates not-null constraint" 오류
**원인**: 필수 필드(`user_id`, `email`, `name`, `is_visible`)가 누락됨

**해결**:
- ProfileForm에서 필수 필드 검증 추가
- `user_id`, `email`은 로그인 정보에서 자동으로 가져옴

### 3. "invalid input syntax for type" 오류
**원인**: 데이터 타입 불일치 (예: 배열이 아닌데 배열로 전송)

**해결**:
- `interests`와 `hashtags`는 반드시 문자열 배열
- 쉼표로 구분된 문자열을 `.split(',').map(i => i.trim())`로 변환

### 4. 이미지 업로드 실패
**원인**: Storage 버킷 정책이 설정되지 않음

**해결**:
- `supabase-rls-policies.sql` 실행
- 또는 base64로 변환되어 localStorage에 저장됨

## 테스트 방법

### 1. 네트워크 탭 확인
1. 브라우저 개발자 도구 > Network
2. "profiles" 필터 적용
3. POST 또는 PATCH 요청 확인
4. Payload와 Response 탭 확인

### 2. Supabase Dashboard 확인
1. Supabase Dashboard > Table Editor
2. profiles 테이블 선택
3. 데이터가 올바르게 저장되었는지 확인

### 3. 콘솔 로그 확인
- 📤 = 전송 데이터
- ✅ = 성공 응답
- ❌ = 에러
- ⚠️ = 경고/폴백

## 데이터 유효성 체크리스트

프로필 생성/업데이트 전에 확인:

- [ ] `user_id`가 유효한 문자열인가?
- [ ] `email`이 올바른 이메일 형식인가?
- [ ] `name`이 비어있지 않은가?
- [ ] `interests`와 `hashtags`가 배열인가?
- [ ] `is_visible`이 boolean인가?
- [ ] `avatar_url`이 유효한 URL 또는 base64인가?
- [ ] 선택 필드가 빈 문자열이 아닌 undefined인가?

## 권장사항

1. **유효성 검증 추가**: ProfileForm에서 클라이언트 사이드 검증
2. **에러 메시지 개선**: 사용자에게 더 친절한 에러 메시지 표시
3. **재시도 로직**: 네트워크 오류 시 자동 재시도
4. **낙관적 업데이트**: UI를 먼저 업데이트하고 백그라운드에서 저장
