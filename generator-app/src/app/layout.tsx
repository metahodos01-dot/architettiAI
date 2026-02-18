import type { Metadata } from "next";
import "./globals.css";
import { ProcessProvider } from "@/lib/processContext";

export const metadata: Metadata = {
  title: "n8n Workflow Generator | MetàHodos",
  description: "Generate n8n workflows from natural language descriptions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ProcessProvider>
          {children}
        </ProcessProvider>
      </body>
    </html>
  );
}
