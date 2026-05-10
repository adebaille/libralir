import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import type { LibraryBook } from "../../services/libraryApi";
import InProgressBookCard from "./InProgressBookCard";

type InProgressBooksProps = {
  books: LibraryBook[];
};

export default function InProgressBooks({ books }: InProgressBooksProps) {
  // On affiche au max les 3 lectures les plus récentes
  const displayedBooks = books.slice(0, 3);

  return (
    <section aria-label="Lectures en cours">
      {/* Header avec lien vers la bibliothèque */}
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-xl font-semibold text-gray-900">
          Lectures en cours
        </h2>
        {books.length > 0 && (
          <Link
            to="/library?status=in_progress"
            className="flex items-center gap-1 text-sm text-violet-700 hover:text-violet-900 transition-colors"
          >
            Tout voir
            <LuArrowRight className="text-base" />
          </Link>
        )}
      </div>

      {/* Liste des livres ou état vide */}
      {displayedBooks.length > 0 ? (
        <div className="space-y-2">
          {displayedBooks.map((book) => (
            <InProgressBookCard key={book.user_book_id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

// État vide : aucune lecture en cours
function EmptyState() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
      <p className="text-gray-600 mb-3">
        Aucune lecture en cours pour le moment
      </p>
      <Link
        to="/library/add"
        className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:text-violet-900 transition-colors"
      >
        Ajouter un livre
        <LuArrowRight className="text-base" />
      </Link>
    </div>
  );
}