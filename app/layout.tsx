import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import './globals.css';

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Taofik Muhriz — Data Science & Software',
  description:
    'Meet Taofik Muhriz: data scientist and software builder. Explore machine learning research, data platforms, ongoing projects, and life beyond the work.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`}>{children}</body>
    </html>
  );
}
