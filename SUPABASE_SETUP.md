# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성하세요.
2. "New Project" 버튼을 클릭하여 새 프로젝트를 생성하세요.
3. 프로젝트 이름, 데이터베이스 비밀번호, 지역을 설정하세요.

## 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase 환경변수 값 찾기:

1. Supabase 대시보드에서 프로젝트를 선택하세요.
2. 왼쪽 메뉴에서 "Settings" → "API"를 클릭하세요.
3. "Project URL"을 `REACT_APP_SUPABASE_URL`에 복사하세요.
4. "anon public" 키를 `REACT_APP_SUPABASE_ANON_KEY`에 복사하세요.


## 3. 데이터베이스 설정

### 초기 설정:
1. Supabase 대시보드에서 "SQL Editor"를 클릭하세요.
2. `supabase-setup.sql` 파일의 내용을 복사하여 붙여넣으세요.
3. "RUN" 버튼을 클릭하여 실행하세요.

### 테이블을 삭제한 경우 재생성:
테이블을 삭제했다면 다음 중 하나를 사용하세요:

**옵션 A - 테이블만 재생성:**
- `recreate-registrations-table.sql` 파일 내용을 SQL Editor에서 실행

**옵션 B - 완전한 설정 (추천):**
- `complete-setup.sql` 파일 내용을 SQL Editor에서 실행
- 테이블 + 스토리지 + 모든 정책을 한번에 설정

## 4. 스토리지 설정

1. Supabase 대시보드에서 "Storage"를 클릭하세요.
2. "pitch-files" 버킷이 생성되었는지 확인하세요.
3. 버킷 설정에서 "Public" 옵션이 활성화되어 있는지 확인하세요.

## 5. 테이블 구조

### registrations 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 기본키 (자동 생성) |
| name | VARCHAR(100) | 이름 |
| phone | VARCHAR(20) | 전화번호 |
| email | VARCHAR(255) | 이메일 |
| organization | VARCHAR(255) | 소속 기관 |
| position | VARCHAR(100) | 직책 |
| is_founder | BOOLEAN | 창업 여부 |
| company_name | VARCHAR(255) | 창업 회사명 |
| is_pitching | BOOLEAN | IR 피칭 참여 여부 |
| pitch_file_url | TEXT | 피칭 자료 파일 URL |
| privacy_agreed | BOOLEAN | 개인정보 동의 여부 |
| created_at | TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | 수정일시 |

## 6. 보안 설정

- RLS(Row Level Security)가 활성화되어 있습니다.
- 누구나 참가신청 데이터를 삽입할 수 있습니다.
- 인증된 사용자만 데이터를 조회할 수 있습니다.
- 피칭 파일은 누구나 업로드하고 조회할 수 있습니다.

## 7. 테스트

설정이 완료되면 참가신청 폼을 테스트해보세요:

1. `npm start`로 애플리케이션을 실행하세요.
2. 참가신청 페이지로 이동하세요.
3. 폼을 작성하고 제출해보세요.
4. Supabase 대시보드에서 데이터가 정상적으로 저장되었는지 확인하세요.

## 문제 해결

### RLS 정책 오류 해결 ⚠️

만약 다음과 같은 오류가 발생한다면:
```
new row violates row-level security policy for table "registrations"
```

**해결 방법 (3가지 옵션):**

#### **옵션 1 - RLS 정책 수정 (권장):**
`fix-rls-final.sql` 파일 내용을 SQL Editor에서 실행:
```sql
-- 모든 정책 삭제 후 새로 생성
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_insert" ON registrations
  FOR INSERT TO anon WITH CHECK (true);
```

#### **옵션 2 - RLS 완전 비활성화 (개발용):**
`disable-rls.sql` 파일 내용을 SQL Editor에서 실행:
```sql
-- 개발/테스트 환경에서만 사용
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
```

#### **옵션 3 - 수동 명령:**
SQL Editor에서 직접 실행:
```sql
-- 빠른 해결
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
```

### 일반적인 오류들:

1. **환경변수 오류**: `.env` 파일이 프로젝트 루트에 있는지, 변수명이 정확한지 확인하세요.
2. **CORS 오류**: Supabase 프로젝트 설정에서 도메인이 허용되어 있는지 확인하세요.
3. **권한 오류**: RLS 정책이 올바르게 설정되어 있는지 확인하세요.
4. **스토리지 오류**: 버킷이 생성되어 있고 public 설정이 되어 있는지 확인하세요.

문제가 지속되면 Supabase 문서를 참조하거나 커뮤니티에 문의하세요.
