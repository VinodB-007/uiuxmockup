import type { Metadata } from "next";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import Provider from "./provider";
import { Toaster } from "sonner";

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
    <ClerkProvider>
    <html
      lang="en"
     
    >
      <body>
        <Provider>{children}</Provider>
        <Toaster position="top-center" richColors/>
        
        </body>
    </html>
    </ClerkProvider>
  );
}
