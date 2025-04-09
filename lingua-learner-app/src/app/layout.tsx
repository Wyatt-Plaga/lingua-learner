import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lingua Learner",
  description: "Interactive Language Learning App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar user={user} />
        <main className="min-h-screen flex flex-col items-center pt-16">
            {children}
        </main>
      </body>
    </html>
  );
}
