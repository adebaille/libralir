import { Link } from "react-router-dom";
import type { LibraryBook } from "../../services/libraryApi";
import StatusBadge from "./StatusBadge";

type LibraryCardProps = {
  book: LibraryBook;
};

export default function LibraryCard({ book }: LibraryCardProps) {
  const progress =
    book.total_pages > 0
      ? Math.round((book.current_page / book.total_pages) * 100)
      : 0;

  return (
    <Link
      to={`/library/${book.user_book_id}`}
      className="block bg-white rounded-xl p-3 border border-gray-100 hover:border-violet-300 transition-colors">
      {/* Couverture */}
      <div className="aspect-2/3 bg-gray-100 rounded-md overflow-hidden mb-3 shadow-sm">
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
      <div className="space-y-1">
        <h3 className="font-serif font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        {book.author && (
          <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
        )}

        {/* Badge de statut */}
        <div className="mt-2">
          <StatusBadge status={book.status} />
        </div>

        {/* Barre de progression (uniquement pour in_progress) */}
        {book.status === "in_progress" && (
          <div className="pt-2">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </div>
        )}
      </div>
    </Link>
  );
}
