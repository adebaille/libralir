import type { LibraryBook } from "../../services/libraryApi";

type BookHeaderProps = {
  book: LibraryBook;
};

export default function BookHeader({ book }: BookHeaderProps) {
  return (
    <header className="flex gap-4 mb-6">
      {/* Couverture */}
      <div className="shrink-0 w-28 h-40 md:w-32 md:h-48 bg-gray-100 rounded-lg overflow-hidden shadow-md">
        {book.thumbnail_url ? (
          <img
            src={book.thumbnail_url}
            alt={`Couverture de ${book.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-2">
            Pas de couverture
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
            {book.title}
          </h1>
          {book.author && (
            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            {book.total_pages} pages
          </p>
          {book.categories.length > 0 && (
            <ul className="flex flex-wrap gap-1" aria-label="Catégories">
              {book.categories.map((category) => (
                <li
                  key={category}
                  className="bg-violet-50 text-violet-700 text-xs px-2 py-0.5 rounded-full"
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}