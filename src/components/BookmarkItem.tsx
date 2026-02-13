'use client';

import { useState } from 'react';
import { Bookmark } from '@/hooks/useBookmarks';

type BookmarkItemProps = {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<void>;
};

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      try {
        setIsDeleting(true);
        await onDelete(bookmark.id);
      } catch (error) {
        alert('Error deleting bookmark');
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {bookmark.title || 'Untitled'}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-800 break-all line-clamp-2"
          >
            {bookmark.url}
          </a>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(bookmark.created_at).toLocaleDateString()} at{' '}
            {new Date(bookmark.created_at).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-shrink-0 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 transition-colors"
          title="Delete bookmark"
        >
          {isDeleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

