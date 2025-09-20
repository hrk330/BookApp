"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-lg backdrop-blur-md bg-opacity-80">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-extrabold text-2xl text-white tracking-tight drop-shadow-lg hover:scale-105 transition-transform"
            >
              <span className="inline-block bg-white/20 rounded-full p-1">
                <svg
                  className="h-7 w-7 text-white"
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
              </span>
              <span>Book Catalog</span>
            </Link>
            {isAuthed && (
              <Link
                href="/add"
                className="hidden sm:block text-sm font-semibold text-white bg-white/10 px-4 py-2 rounded-full shadow hover:bg-white/20 transition-colors"
              >
                + Add Book
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthed && (
              <span className="hidden sm:block text-sm text-white/90 truncate max-w-32 font-medium">
                {session?.user?.name || session?.user?.email}
              </span>
            )}
            {isAuthed ? (
              <button
                onClick={() => {
                  toast.info("Signing out...");
                  signOut();
                }}
                className="rounded-full bg-white/20 px-4 py-2 text-white font-semibold text-sm shadow hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  toast.info("Redirecting to sign in...");
                  signIn();
                }}
                className="rounded-full bg-white/20 px-4 py-2 text-white font-semibold text-sm shadow hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Login
              </button>
            )}
          </div>
        </div>
        {/* Mobile Add Book Link */}
        <div className="sm:hidden mt-3 flex justify-center">
          {isAuthed && (
            <Link
              href="/add"
              className="text-sm font-semibold text-white bg-white/10 px-4 py-2 rounded-full shadow hover:bg-white/20 transition-colors"
            >
              + Add Book
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
