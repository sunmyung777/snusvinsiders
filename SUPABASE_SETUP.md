# Supabase 설정 가이드

## ⚠️ 중요: Foreign Key 제약 조건 문제

현재 발생한 오류:
```
insert or update on table "profiles" violates foreign key constraint "profiles_user_id_fkey"
Key is not present in table "users".
```

**원인**: Supabase에서 자동으로 `profiles.user_id`가 `auth.users` 테이블을 참조하는 foreign key를 생성했습니다.
**문제**: 우리는 Supabase Auth를 사용하지 않으므로 `auth.users` 테이블이 비어있습니다.

## 해결 방법

### 1️⃣ Foreign Key 제약 조건 제거 (필수!)

Supabase Dashboard > SQL Editor에서 실행:

```sql
-- Foreign Key 제약 조건 제거
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- 인덱스 확인 (성능을 위해)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
```

또는 프로젝트 루트의 `fix-foreign-key.sql` 파일을 실행하세요.

### 2️⃣ RLS 정책 적용 (필수!)

Supabase Dashboard > SQL Editor에서 `supabase-rls-policies.sql` 파일 내용을 실행

**중요**: messages 테이블에 RLS 정책이 없으면 메시지가 저장되지 않습니다!

### 3️⃣ 테스트 데이터 추가

```sql
-- registrations 테이블에 테스트 데이터 추가
INSERT INTO registrations (name, email, phone, organization, position, is_founder, privacy_agreed)
VALUES
  ('김개발', 'dev@example.com', '010-1234-5678', '개발회사', '개발자', true, true),
  ('박테스트', 'test@example.com', '010-9876-5432', '테스트회사', '매니저', false, true);
```

## 테스트

1. 앱 실행: `npm start`
2. 로그인:
   - 이름: `김개발`
   - 이메일: `dev@example.com`
3. 프로필 등록
4. 브라우저 콘솔에서 로그 확인:
   ```
   📤 Supabase로 전송할 프로필 데이터: {...}
   ✅ Supabase 프로필 생성 응답: {...}
   ```

## 일반적인 오류와 해결

### 1. Foreign Key 오류 (23503)
```
violates foreign key constraint "profiles_user_id_fkey"
```
→ 위의 1️⃣ 단계 실행

### 2. Unauthorized 오류
```
new row violates row-level security policy
```
→ 위의 2️⃣ 단계 실행 (RLS 정책)

### 3. Duplicate Key 오류 (23505)
```
duplicate key value violates unique constraint
```
→ 이미 같은 user_id로 프로필이 생성됨. 로그아웃 후 다시 시도

## 프로덕션 체크리스트

- [ ] Foreign Key 제약 조건 제거
- [ ] RLS 정책 설정
- [ ] Storage 버킷 및 정책 설정
- [ ] 테스트 데이터 추가 및 검증
- [ ] 네트워크 탭에서 API 호출 확인
- [ ] Supabase Dashboard에서 데이터 확인
