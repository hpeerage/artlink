import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/NextAuthSessionProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Header from "@/components/common/Header";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtLink | 실물 크기 AR 작품 체험 및 렌탈",
  description: "2D 작품 이미지를 3D 액자에 매핑하여 1:1 스케일로 AR 체험하고 정기 렌탈하는 차세대 아트 커머스 플랫폼",
  keywords: ["AR", "증강현실", "미술작품", "그림렌탈", "구독경제", "인테리어", "WebAR"],
  openGraph: {
    title: "ArtLink | 예술을 일상의 스케일로 링크하다",
    description: "AR로 내 방에 그림을 미리 걸어보는 가장 스마트한 방법",
    url: "https://artlink.hpeerage.com",
    siteName: "ArtLink",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
      }
    ],
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ArtLink",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${montserrat.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans min-h-full flex flex-col">
        <NextAuthSessionProvider>
          <LanguageProvider>
            <Header />
            {children}
          </LanguageProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
