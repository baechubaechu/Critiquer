import type { Metadata } from "next";
import { FeedbackPanel } from "@/components/feedback-panel";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRITIQUER",
  description:
    "건축 거장들을 교수님으로 선택해 설계 크리틱을 받는 AI 기반 스튜디오 도구입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <FeedbackPanel />
      </body>
    </html>
  );
}
