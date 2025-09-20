import Navbar from '@/components/Navbar';
import BookCard from '@/components/BookCard';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
  const userId = (session?.user as any)?.id as string | undefined;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">All Books</h1>
        <p className="text-gray-600">Discover and manage your book collection</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((b) => (
            <BookCard
              key={b.id}
              id={b.id}
              title={b.title}
              author={b.author}
              genre={b.genre}
              canDelete={userId === b.userId}
            />
          ))}
          {books.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first book to the collection.</p>
              <a href="/add" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Add Your First Book
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}


