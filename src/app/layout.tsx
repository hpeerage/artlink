import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/NextAuthSessionProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtLink | 실물 크기 AR 작품 체험 및 렌탈",
  description: "2D 작품 이미지를 3D 액자에 매핑하여 1:1 스케일로 AR 체험하고 정기 렌탈하는 아트 플랫폼",
  icons: {
    icon: "/logo.svg",
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
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
