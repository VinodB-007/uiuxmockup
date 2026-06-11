import type { Metadata } from "next";
import { DM_Sans} from "next/font/google";
import "./globals.css";

const appFont = DM_Sans({
  subsets:['latin']
})

export const metadata: Metadata = {
  title: "UIUX Mockup generator app",
  description: "Generate high quality Free UIUX mobile and web mockup design ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
     
    >
      <body 
      className={appFont.className}
      >
        {children}</body>
    </html>
  );
}
