import "./globals.css";
import { BotIdClient } from "botid/client";
import { Metadata } from "next";
import { Toaster } from "sonner";

const protectedRoutes = [
  {
    path: "/api/chat",
    method: "POST",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-provider-registry.vercel.app"),
  title: "Provider Registry Preview",
  description:
    "Handle multiple providers and models and switch between them easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <BotIdClient protect={protectedRoutes} />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
