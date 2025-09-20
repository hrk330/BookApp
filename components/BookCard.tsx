"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

type Props = {
  id: string;
  title: string;
  author: string;
  genre: string;
  canDelete?: boolean;
};

export default function BookCard({
  id,
  title,
  author,
  genre,
  canDelete,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Book deleted successfully!");
          router.refresh();
        } else {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || "Failed to delete book");
        }
      } catch (error) {
        toast.error("Failed to delete book");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-shadow duration-200 p-6 flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-3">
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-1">
            Book Title
          </span>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
            {title || <span className="italic text-gray-400">No Title</span>}
          </h3>
        </div>
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-1">
            Author
          </span>
          <p className="text-base text-gray-700 mb-1">
            {author || (
              <span className="italic text-gray-400">Unknown Author</span>
            )}
          </p>
        </div>
        <div>
          <span className="block text-xs font-semibold text-gray-500 mb-1">
            Genre
          </span>
          <span className="inline-block text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full shadow">
            {genre || <span className="italic text-gray-200">No Genre</span>}
          </span>
        </div>
      </div>
      {canDelete && (
        <div className="mt-5 pt-4 border-t border-gray-200">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="w-full rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-white font-semibold text-sm shadow hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
