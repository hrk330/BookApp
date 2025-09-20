"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function Navbar() {
  const { data: session, status } = useSession();
  console.log("[Navbar] useSession status:", status, "session:", session);
  const isAuthed = status === "authenticated";

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors"
            >
              Book Catalog
            </Link>
            <Link
              href="/add"
              className="hidden sm:block text-sm text-blue-600 hover:underline"
            >
              Add Book
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthed && (
              <span className="hidden sm:block text-sm text-gray-700 truncate max-w-32">
                {session?.user?.name || session?.user?.email}
              </span>
            )}
            {isAuthed ? (
              <button
                onClick={() => {
                  toast.info("Signing out...");
                  signOut();
                }}
                className="rounded bg-gray-800 px-3 py-1.5 text-white text-sm hover:bg-gray-900 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  toast.info("Redirecting to sign in...");
                  signIn();
                }}
                className="rounded bg-blue-600 px-3 py-1.5 text-white text-sm hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
        {/* Mobile Add Book Link */}
        <div className="sm:hidden mt-2">
          <Link href="/add" className="text-sm text-blue-600 hover:underline">
            Add Book
          </Link>
        </div>
      </div>
    </nav>
  );
}
