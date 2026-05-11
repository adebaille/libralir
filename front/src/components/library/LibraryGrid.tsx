import type { LibraryBook } from "../../services/libraryApi";
import LibraryCard from "./LibraryCard";

type LibraryGridProps = {
  books: LibraryBook[];
};

export default function LibraryGrid({ books }: LibraryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {books.map((book) => (
        <LibraryCard key={book.user_book_id} book={book} />
      ))}
    </div>
  );
}