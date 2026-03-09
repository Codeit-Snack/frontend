import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  LandingHeader,
  LoginHeader,
  LoggedInHeader,
  CenterHeader,
  FullWidthCenterHeader,
  MobileHeader,
  DetailHeader,
  AdminHeader,
  SuperAdminHeader,
} from "./Headers";

const meta: Meta<typeof LandingHeader> = {
  title: "Components/Header/Headers",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;

/** 랜딩: 주황 바, 로고만 */
export const Landing: StoryObj<typeof LandingHeader> = {
  render: () => <LandingHeader />,
};

/** 로그인 전: 로고 + 로그인/기본 당일권 회원가입 */
export const Login: StoryObj<typeof LoginHeader> = {
  render: () => <LoginHeader />,
};

/** 로그인 후 랜딩용 (Login과 동일) */
export const LoggedIn: StoryObj<typeof LoggedInHeader> = {
  render: () => <LoggedInHeader />,
};

/** 주황 바, 로고 중앙(더 큼) */
export const Center: StoryObj<typeof CenterHeader> = {
  render: () => <CenterHeader />,
};

/** 주황 바 풀 width, 로고 중앙 가장 큼 */
export const FullWidthCenter: StoryObj<typeof FullWidthCenterHeader> = {
  render: () => <FullWidthCenterHeader />,
};

/** 모바일 · 비로그인 */
export const MobileGuest: StoryObj<typeof MobileHeader> = {
  render: () => <MobileHeader isLoggedIn={false} />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** 모바일 · 로그인 · 회원, 장바구니 없음 */
export const MobileMember: StoryObj<typeof MobileHeader> = {
  render: () => <MobileHeader isLoggedIn userRole="member" cartCount={0} />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** 모바일 · 로그인 · 회원, 장바구니 2개 */
export const MobileMemberWithCart: StoryObj<typeof MobileHeader> = {
  render: () => <MobileHeader isLoggedIn userRole="member" cartCount={2} />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** 모바일 · 로그인 · 관리자 */
export const MobileAdmin: StoryObj<typeof MobileHeader> = {
  render: () => <MobileHeader isLoggedIn userRole="admin" cartCount={2} />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** 모바일 · 로그인 · 최고관리자 */
export const MobileSuperAdmin: StoryObj<typeof MobileHeader> = {
  render: () => <MobileHeader isLoggedIn userRole="superAdmin" cartCount={2} />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** PC · 회원 (Detail): 상품 리스트, 구매 요청 내역, 상품 등록 내역 */
export const Detail: StoryObj<typeof DetailHeader> = {
  render: () => <DetailHeader cartCount={0} />,
};

/** PC · 회원 · 장바구니 2개 */
export const DetailWithCart: StoryObj<typeof DetailHeader> = {
  render: () => <DetailHeader cartCount={2} />,
};

/** PC · 관리자: + 구매 요청 관리, 구매 내역 확인 */
export const Admin: StoryObj<typeof AdminHeader> = {
  render: () => <AdminHeader cartCount={2} />,
};

/** PC · 최고관리자: + 관리 */
export const SuperAdmin: StoryObj<typeof SuperAdminHeader> = {
  render: () => <SuperAdminHeader cartCount={2} />,
};
