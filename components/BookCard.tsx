"use client";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';

type Props = {
  id: string;
  title: string;
  author: string;
  genre: string;
  canDelete?: boolean;
};

export default function BookCard({ id, title, author, genre, canDelete }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Book deleted successfully!');
          router.refresh();
        } else {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || 'Failed to delete book');
        }
      } catch (error) {
        toast.error('Failed to delete book');
      }
    });
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-base font-semibold line-clamp-2 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{author}</p>
          <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{genre}</span>
        </div>
        {canDelete && (
          <div className="mt-4 pt-3 border-t">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="w-full rounded bg-red-600 px-3 py-2 text-white text-sm disabled:opacity-60 hover:bg-red-700 transition-colors"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


