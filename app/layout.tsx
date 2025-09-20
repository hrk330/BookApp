import '@/app/globals.css';
import { ReactNode } from 'react';
import Providers from './providers';

export const metadata = {
  title: 'Book Catalog App',
  description: 'Full-stack Book Catalog with Next.js, Prisma, and NextAuth',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


