.
├── src/
│ ├── app/
│ │ ├── actions.ts # Server Actions (백엔드와 통신)
│ │ ├── layout.tsx # 전역 레이아웃
│ │ └── page.tsx # 메인 UI (Server Component)
│ ├── components/
│ │ └── TodoItem.tsx # 개별 할 일 (Client Component)
│ └── lib/
│ └── api.ts # 외부 API 호출 유틸리티
├── public/ # 정적 파일 (이미지 등) → URL은 `/파일명`으로 접근
├── .env # 환경 변수 (백엔드 주소 설정)
└── package.json # 의존성 설정

---

## 이미지 사용 방법

**이미지가 안 보였던 이유 (해결됨)**

- **미들웨어**가 `/google-logo.png` 같은 정적 요청까지 가로채서, 로그인 안 된 상태에서 이미지 요청이 `/login`으로 리다이렉트되고, 브라우저가 HTML을 이미지로 받아 깨져 보였습니다.
- `src/middleware.ts`의 `matcher`에서 이미지 등 정적 확장자(`.png`, `.jpg`, `.svg` 등)를 제외해 두었습니다. 이제 `public/` 파일은 미들웨어를 거치지 않고 그대로 서빙됩니다.

**이미지를 쓸 때**

1. **파일 위치**: `public/` 폴더에 넣기 (예: `public/logo.png`)
2. **주소**: 브라우저 기준 루트이므로 `/logo.png` 로 참조
3. **컴포넌트**: `next/image` 사용 (기본 최적화 그대로 사용)

```tsx
import Image from "next/image";

<Image src="/logo.png" alt="로고" width={120} height={40} />
```

- `width` / `height`는 레이아웃 시프트 방지를 위해 지정하는 편이 좋습니다.
- 외부 URL을 쓸 때는 `next.config.mjs`의 `images.remotePatterns` 설정이 필요할 수 있습니다.
