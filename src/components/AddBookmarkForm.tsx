'use client';

import { useState } from 'react';

type AddBookmarkFormProps = {
  onAddBookmark: (url: string, title: string) => Promise<void>;
  isLoading?: boolean;
};

export default function AddBookmarkForm({
  onAddBookmark,
  isLoading = false,
}: AddBookmarkFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddBookmark(url.trim(), title.trim());
      setUrl('');
      setTitle('');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error adding bookmark';
      setError(errorMessage);
      console.error('Error adding bookmark:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Bookmark</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., GitHub"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            disabled={isSubmitting || isLoading}
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g., https://github.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            disabled={isSubmitting || isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  );
}

