"use client";
import Link from "next/link";

import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "@/lib/toast";
import { useState, useRef } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";
  const [showUserCard, setShowUserCard] = useState(false);
  const userCardTimeout = useRef<NodeJS.Timeout | null>(null);

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
              <div
                className="relative outline-none focus:outline-none focus-visible:outline-none"
                onMouseEnter={() => {
                  if (userCardTimeout.current)
                    clearTimeout(userCardTimeout.current);
                  setShowUserCard(true);
                }}
                onMouseLeave={() => {
                  userCardTimeout.current = setTimeout(
                    () => setShowUserCard(false),
                    120
                  );
                }}
                onFocus={() => setShowUserCard(true)}
                onBlur={() => setShowUserCard(false)}
                tabIndex={0}
              >
                <span
                  className="block text-xs sm:text-sm text-white/90 truncate max-w-[90px] sm:max-w-32 font-medium text-center cursor-pointer transition-colors duration-150 hover:bg-white/20 hover:text-white px-2 py-1 rounded outline-none"
                  title={
                    (session?.user?.name || session?.user?.email) ?? undefined
                  }
                >
                  {session?.user?.name || session?.user?.email}
                </span>
                {showUserCard && (
                  <div
                    className="absolute left-1/2 z-50 -translate-x-1/2 mt-2 w-72 rounded-2xl bg-white/80 shadow-2xl border-2 border-transparent bg-clip-padding p-5 text-gray-900 text-sm animate-fade-in backdrop-blur-xl outline-none focus:outline-none focus-visible:outline-none"
                    style={{
                      borderImage:
                        "linear-gradient(90deg, #6366f1 0%, #a21caf 100%) 1",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold shadow">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-base text-gray-900 mb-0.5 truncate">
                          <span className="font-semibold text-gray-700">
                            Name:
                          </span>{" "}
                          {session?.user?.name || (
                            <span className="italic text-gray-400">
                              No Name
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          <span className="font-semibold text-gray-700">
                            Email:
                          </span>{" "}
                          {session?.user?.email || (
                            <span className="italic text-gray-400">
                              No Email
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold text-gray-700">
                        Status:
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold align-middle shadow">
                        Logged in
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {isAuthed ? (
              <button
                onClick={() => {
                  toast.info("Signing out...");
                  setTimeout(() => {
                    signOut();
                  }, 900); // 900ms delay so toast is visible
                }}
                className="rounded-full bg-white/20 px-4 py-2 text-white font-semibold text-sm shadow hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  toast.info("Redirecting to sign in...");
                  setTimeout(() => {
                    signIn();
                  }, 900);
                }}
                className="rounded-full bg-white/20 px-4 py-2 text-white font-semibold text-sm shadow hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Sign In
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
