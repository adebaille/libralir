import type { LibraryBook } from "../../services/libraryApi";
import LibraryRow from "./LibraryRow";

type LibraryListProps = {
  books: LibraryBook[];
};

export default function LibraryList({ books }: LibraryListProps) {
  return (
    <div className="space-y-2">
      {books.map((book) => (
        <LibraryRow key={book.user_book_id} book={book} />
      ))}
    </div>
  );
}