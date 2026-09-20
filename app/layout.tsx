import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRITIQUER",
  description:
    "건축 거장들을 교수님으로 선택해 설계 크리틱을 받는 스튜디오입니다.",
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
