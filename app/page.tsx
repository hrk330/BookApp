import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  const books = userId
    ? await prisma.book.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <section className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-3">
            Your Book Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-4">
            Discover, manage, and cherish your personal library
          </p>
          {/* Show Add Book button here only if NOT logged in or (logged in and has no books) */}
          {(!userId || books.length === 0) && (
            <a
              href="/add"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              + Add New Book
            </a>
          )}
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((b) => (
            <div
              key={b.id}
              className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-200"
            >
              <BookCard
                id={b.id}
                title={b.title}
                author={b.author}
                genre={b.genre}
                canDelete={userId === b.userId}
              />
            </div>
          ))}
          {books.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="mb-6 animate-bounce">
                <svg
                  className="h-16 w-16 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No books yet
              </h3>
              <p className="text-gray-600 mb-6 text-center">
                Start building your library by adding your first book.
              </p>
              {/* Show Add Book button here only if NOT logged in or (logged in and has no books) */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
