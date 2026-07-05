import React from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Elev8 — Toronto AI Networking',
  description:
    'The localized professional network layer for Toronto. Discover events, meet people, and grow your career.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#6366f1',
          colorBackground: '#0f172a',
          colorInputBackground: '#1e293b',
          colorInputText: '#f8fafc',
          colorText: '#f8fafc',
          colorTextOnPrimaryBackground: '#ffffff',
        },
      }}
    >
      <html lang="en">
        <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
