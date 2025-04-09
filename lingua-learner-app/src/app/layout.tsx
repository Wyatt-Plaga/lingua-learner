import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import AuthButton from "@/components/AuthButton";

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
        <nav className="w-full border-b border-b-foreground/10 h-16">
            <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-full text-sm">
                <div>Lingua Learner</div>
                <AuthButton user={user} />
            </div>
        </nav>
        <main className="min-h-screen flex flex-col items-center">
            {children}
        </main>
      </body>
    </html>
  );
}
