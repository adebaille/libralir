import type { LibraryBook } from "../../services/libraryApi";

type BookProgressProps = {
  book: LibraryBook;
};

export default function BookProgress({ book }: BookProgressProps) {
  const progress =
    book.total_pages > 0
      ? Math.round((book.current_page / book.total_pages) * 100)
      : 0;

  return (
    <section
      aria-label="Progression de lecture"
      className="bg-white rounded-xl p-4 border border-gray-100 mb-6"
    >
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-serif text-lg font-semibold text-gray-900">
          Progression
        </h2>
        <span className="text-2xl font-semibold text-violet-700">
          {progress}%
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-violet-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-gray-600">
        Page {book.current_page} sur {book.total_pages}
      </p>
    </section>
  );
}