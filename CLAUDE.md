# web-plate — CIRA UI 서버

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **역할** | CIRA 서비스 프론트엔드 (Next.js App Router) |
| **프레임워크** | Next.js 16 (App Router, React 19) |
| **언어** | TypeScript 5 |
| **스타일** | Tailwind CSS v3 (유틸리티 클래스 기반, inline style 금지) |
| **상태 관리** | TanStack Query v5 (서버 상태) / Zustand v5 (클라이언트 상태) |
| **폼** | react-hook-form + zod |
| **에디터** | Tiptap (WikiEditor 등 rich-text 영역) |
| **차트** | Recharts |
| **인증** | next-auth v5 (Credentials Provider → JWT) |

---

## 디렉터리 구조 규칙

```
src/
├── app/                        # Next.js 라우트
│   ├── (auth)/                 # 비로그인 전용 라우트
│   └── (main)/                 # 로그인 필요 라우트
│       └── projects/[projectId]/
│           ├── issues/
│           ├── boards/
│           ├── sprints/
│           ├── reports/
│           ├── settings/
│           ├── versions/
│           └── wiki/
├── components/                 # 재사용 UI 컴포넌트
│   ├── auth/
│   ├── board/
│   ├── issue/
│   ├── layout/
│   ├── project/
│   ├── search/
│   ├── sprint/
│   ├── version/
│   ├── wiki/
│   └── ui/                     # 공통 Primitive (Toast, Skeleton 등)
├── hooks/                      # TanStack Query 훅 (use*.ts)
├── lib/
│   └── api/                    # API 클라이언트 함수 (axios 래퍼)
└── types/                      # TS 타입 정의
```

---

## 컴포넌트 생성 규칙

1. **파일명**: PascalCase (`IssueTable.tsx`, `CreateIssueModal.tsx`)
2. **모든 컴포넌트 파일 첫 줄**: `"use client"` 선언 (서버 컴포넌트는 예외)
3. **페이지 (`page.tsx`)**: 최소한의 레이아웃 + 데이터 fetch 위임 → 비즈니스 로직은 훅/컴포넌트로 분리
4. **모달**: `boolean` 상태 + overlay 패턴, 외부 클릭 시 닫힘 처리 필수
5. **로딩 상태**: `animate-pulse` 스켈레톤 적용
6. **에러 상태**: 사용자 친화적 메시지 + `useToast` 훅으로 Toast 표시

---

## API 연동 규칙

- **API 클라이언트**: `src/lib/api/client.ts` (axios, baseURL: `/api/proxy`)
- **API 함수**: `src/lib/api/{도메인}.ts` — 단순 HTTP 호출 함수만 포함
- **훅**: `src/hooks/use{Domain}.ts` — TanStack Query `useQuery` / `useMutation` 래핑
- **응답 구조**: 서버 응답 `{ success, data }` → `res.data.data` 로 접근
- **파일 업로드**: `multipart/form-data` 사용 시 `Content-Type` 헤더를 명시적으로 제거 (axios가 자동 설정)
- **인증 토큰**: next-auth 세션의 `accessToken`은 `/api/proxy/[...path]/route.ts`가 서버사이드에서 자동 주입

---

## 상태 관리 규칙

- 서버 데이터: **TanStack Query** — `queryKey` 컨벤션: `[도메인, id, ...필터]`
- 변경(mutation) 후 관련 쿼리 무효화: `queryClient.invalidateQueries({ queryKey: [도메인, ...] })`
- 전역 클라이언트 상태(UI 상태 등): **Zustand** store
- `useState` 는 컴포넌트 내 로컬 UI 상태에만 사용

---

## 스타일 규칙

- Tailwind 유틸리티 클래스 우선 사용
- `clsx` + `tailwind-merge` 조합으로 조건부 클래스 처리
- 색상: Slate 계열 (`slate-50` ~ `slate-900`) 기본, 강조는 `blue-600`
- 라운드: `rounded-lg` (소) / `rounded-xl` (중) / `rounded-2xl` (대) 통일
- 버튼: `h-10`(기본) / `h-8`(소형) 고정 높이
- 인라인 style 속성 사용 금지

---

## 네이밍 컨벤션

| 유형 | 패턴 | 예시 |
|------|------|------|
| 페이지 | `page.tsx` | `issues/page.tsx` |
| 컴포넌트 | PascalCase | `IssueTable.tsx` |
| 훅 | `use` + PascalCase | `useIssues.ts` |
| API 함수 파일 | camelCase | `issues.ts` |
| 타입 파일 | camelCase | `issue.ts` |

---

## 주요 의존성 버전

| 패키지 | 버전 |
|--------|------|
| next | 16.1.3 |
| react | 19.0.1 |
| next-auth | 5.0.0-beta.30 |
| @tanstack/react-query | ^5.100.14 |
| tailwindcss | ^3.4.19 |
| zustand | ^5.0.1 |
| recharts | ^3.8.1 |
| @tiptap/react | ^2.10.4 |

---

## 금지 사항

- `localStorage` / `sessionStorage` 직접 접근 (next-auth 세션 또는 Zustand 사용)
- API 호출을 `page.tsx`에서 직접 수행 (반드시 훅을 통해 호출)
- `any` 타입 남용 (불가피한 경우 주석으로 사유 명시)
- 외부 CDN 스크립트 직접 삽입
