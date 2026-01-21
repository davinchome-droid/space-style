import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPACE STYLE - AI 인테리어 스타일 분석 매거진",
  description: "공간 사진을 업로드하면 AI가 인테리어 사조, 디자인 요소, 컬러 팔레트를 분석하여 전문 매거진 형태로 보여드립니다.",
  keywords: ["인테리어", "스타일 분석", "AI", "매거진", "미드센추리", "스칸디나비안"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
