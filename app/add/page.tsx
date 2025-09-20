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
        router.push("/");
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
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Add a Book</h1>
        {status !== "authenticated" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              You must be logged in to add books.
            </p>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Pragmatic Programmer"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Andy Hunt"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Software"
              required
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">
                Book added successfully! Redirecting to home page...
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={status !== "authenticated" || loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60 hover:bg-blue-700 transition-colors font-medium"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </main>
    </>
  );
}
