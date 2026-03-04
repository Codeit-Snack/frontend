# Frontend

Next.js 기반 프론트엔드 프로젝트

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Client State**: Zustand
- **Server State**: TanStack Query
- **Documentation**: Storybook

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

### Storybook 실행

```bash
npm run storybook
```

[http://localhost:6006](http://localhost:6006)에서 컴포넌트 문서를 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── components/
│   └── ui/                 # shadcn/ui 컴포넌트
├── hooks/
│   └── queries/            # TanStack Query 훅
├── providers/              # React Context Providers
├── stores/                 # Zustand 스토어
└── lib/                    # 유틸리티 함수
```

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run storybook` | Storybook 실행 |
| `npm run build-storybook` | Storybook 빌드 |

## 컴포넌트 추가

shadcn/ui 컴포넌트 추가:

```bash
npx shadcn@latest add [component-name]
```

사용 가능한 컴포넌트 목록은 [shadcn/ui 문서](https://ui.shadcn.com/docs/components)에서 확인할 수 있습니다.
