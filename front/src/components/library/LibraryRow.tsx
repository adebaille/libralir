import { Link } from "react-router-dom";
import type { LibraryBook } from "../../services/libraryApi";
import StatusBadge from "./StatusBadge";

type LibraryRowProps = {
  book: LibraryBook;
};


export default function LibraryRow({ book }: LibraryRowProps) {
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
      <div className="shrink-0 w-14 h-20 bg-gray-100 rounded-md overflow-hidden">
        {book.thumbnail_url ? (
          <img
            src={book.thumbnail_url}
            alt={`Couverture de ${book.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            ?
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-serif font-semibold text-gray-900 line-clamp-1 leading-tight">
            {book.title}
          </h3>
          {book.author && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {book.author}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={book.status} />
          {book.status === "in_progress" && (
            <span className="text-xs text-gray-500">{progress}%</span>
          )}
        </div>
      </div>
    </Link>
  );
}