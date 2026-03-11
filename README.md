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

## shadcn/ui 사용법

### 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]
```

여러 컴포넌트 동시 추가:

```bash
npx shadcn@latest add button card input dialog
```

### 사용 예시

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input placeholder="이메일" type="email" />
        <Input placeholder="비밀번호" type="password" />
        <Button>로그인</Button>
        <Button variant="outline">회원가입</Button>
      </CardContent>
    </Card>
  );
}
```

### Button Variants

```tsx
<Button>Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

사용 가능한 컴포넌트 목록은 [shadcn/ui 문서](https://ui.shadcn.com/docs/components)에서 확인할 수 있습니다.

## Storybook 사용법

### 실행

```bash
npm run storybook
```

[http://localhost:6006](http://localhost:6006)에서 컴포넌트 문서를 확인할 수 있습니다.

### 스토리 파일 작성

스토리 파일은 `*.stories.tsx` 형식으로 컴포넌트와 같은 위치에 생성합니다.

```tsx
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};
```

### 스토리 파일 위치

```
src/components/ui/
├── button.tsx
├── button.stories.tsx    # 컴포넌트와 같은 폴더에 위치
├── card.tsx
├── card.stories.tsx
└── ...
```

### Storybook 빌드

정적 파일로 빌드하여 배포:

```bash
npm run build-storybook
```

빌드 결과물은 `storybook-static/` 폴더에 생성됩니다.
