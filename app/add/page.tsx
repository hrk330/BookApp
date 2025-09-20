"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { toast } from "@/lib/toast";

export default function AddBookPage() {
  const { data: session, status } = useSession();
  console.log("[AddBookPage] useSession status:", status, "session:", session);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !author.trim() || !genre.trim()) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, genre }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add");
      }
      // Show success message
      setError(null);
      setSuccess(true);
      toast.success("Book added successfully!");
      // Clear form
      setTitle("");
      setAuthor("");
      setGenre("");
      // Redirect after a brief delay to show success
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add book";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-2 py-8">
        <div className="w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 bg-white/80 backdrop-blur-md p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-6 text-center">
            Add a Book
          </h1>
          {status !== "authenticated" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 text-center">
                You must be logged in to add books.
              </p>
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Pragmatic Programmer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Author
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Andy Hunt"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Genre
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Software"
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 text-center">
                  Book added successfully!
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={status !== "authenticated" || loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-purple-600 px-4 py-2.5 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-800 hover:to-purple-700 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
