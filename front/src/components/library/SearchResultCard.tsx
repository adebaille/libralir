import { LuPlus } from "react-icons/lu";
import type { SearchResultBook } from "../../services/libraryApi";

type SearchResultCardProps = {
  book: SearchResultBook;
  onAdd: (book: SearchResultBook) => void;
  isAdding: boolean;
};

export default function SearchResultCard({ book, onAdd, isAdding }: SearchResultCardProps) {
  // Google Books n'a pas toujours le nombre de pages
  const canAdd = book.page_count !== null && !isAdding;

  return (
    <article className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100">
      {/* Couverture */}
      <div className="shrink-0 w-16 h-24 bg-gray-100 rounded-md overflow-hidden">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={`Couverture de ${book.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-1">
            Pas de couverture
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <h3 className="font-serif font-semibold text-gray-900 line-clamp-2">
            {book.title}
          </h3>
          {book.authors.length > 0 && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {book.authors.join(", ")}
            </p>
          )}
          {book.page_count !== null ? (
            <p className="text-xs text-gray-400 mt-1">
              {book.page_count} pages
            </p>
          ) : (
            <p className="text-xs text-amber-600 mt-1">
              Nombre de pages inconnu
            </p>
          )}
        </div>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onAdd(book)}
          disabled={!canAdd}
          aria-label={`Ajouter ${book.title} à ma bibliothèque`}
          className="flex items-center justify-center w-10 h-10 bg-violet-500 hover:bg-violet-600 text-white rounded-full transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <LuPlus className="text-xl" />
        </button>
      </div>
    </article>
  );
}