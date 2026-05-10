import { Link } from "react-router-dom";
import type { LibraryBook } from "../../services/libraryApi";

type InProgressBookCardProps = {
  book: LibraryBook;
};

export default function InProgressBookCard({ book }: InProgressBookCardProps) {
  // Calcul du pourcentage de progression
  const progress =
    book.total_pages > 0
      ? Math.round((book.current_page / book.total_pages) * 100)
      : 0;

  return (
    <Link
      to={`/library/${book.user_book_id}`}
      className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:border-violet-300 transition-colors"
    >
      {/* Couverture */}
      <div className="shrink-0 w-16 h-24 bg-gray-100 rounded-md overflow-hidden">
        {book.thumbnail_url ? (
          <img
            src={book.thumbnail_url}
            alt={`Couverture de ${book.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Pas de couverture
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-serif font-semibold text-gray-900 line-clamp-1">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {book.author}
            </p>
          )}
        </div>

        {/* Barre de progression + pourcentage */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progression</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}