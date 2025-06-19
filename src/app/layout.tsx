import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: "제타(zeta) - 상상이 현실이 되는 AI 채팅",
  description: "AI 캐릭터와의 자유로운 대화를 통해 당신의 상상을 현실로 만들어보세요. 다양한 캐릭터들과 함께하는 특별한 AI 채팅 경험.",
  keywords: "AI 채팅, 인공지능, 캐릭터 채팅, 롤플레이, zeta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
