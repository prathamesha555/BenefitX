import type { Metadata } from "next";

import type { ReactNode } from "react";

import { Geist, Geist_Mono } from "next/font/google";

import SiteHeader from "@/components/layout/site-header";

import SiteFooter from "@/components/layout/site-footer";

import { AuthProvider } from "@/components/auth/auth-provider";

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {

  title: {
    default: "BenefitX | Government Schemes & Scholarships",
    template: "%s | BenefitX"
  },

  description:
    "Discover government scholarships, financial assistance and welfare schemes through BenefitX.",

  applicationName: "BenefitX",

  keywords: [
    "BenefitX",
    "Government Scholarships",
    "Government Schemes",
    "Scholarship Finder",
    "Maharashtra Scholarships"
  ]

};


export default function RootLayout({

  children

}: Readonly<{

  children: ReactNode;

}>) {

  return (

    <html lang="en">

      <body
        id="top"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <AuthProvider>

          <div className="flex min-h-screen flex-col">

            <SiteHeader />

            <main className="flex-1">

              {children}

            </main>

            <SiteFooter />

          </div>

        </AuthProvider>

      </body>

    </html>

  );

}