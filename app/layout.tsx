import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRITIQUER",
  description:
    "건축 프로젝트를 구조화된 비평 렌즈로 읽는 AI 기반 스튜디오 크리틱 도구입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
