import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import React from "react";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Hunter Nakagawa",
    description: "Hello, how are you?",
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;

    return (
        <html lang={locale}>
            <body className={`${jetBrainsMono.variable} ${jetBrainsMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
