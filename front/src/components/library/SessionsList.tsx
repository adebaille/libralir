import { LuPlus, LuClock, LuFileText } from "react-icons/lu";
import type { ReadingSession } from "../../services/readingSessionApi";

type SessionsListProps = {
  sessions: ReadingSession[];
  onAddSession: () => void;
};

// Formate une date ISO (YYYY-MM-DD) en format français lisible
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SessionsList({ sessions, onAddSession }: SessionsListProps) {
  return (
    <section
      aria-label="Sessions de lecture"
      className="bg-white rounded-xl p-4 border border-gray-100 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-semibold text-gray-900">
          Sessions de lecture
        </h2>
        <button
          type="button"
          onClick={onAddSession}
          className="flex items-center gap-1 text-sm font-medium text-violet-700 hover:text-violet-900 transition-colors"
        >
          <LuPlus className="text-base" />
          Ajouter
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">
          Aucune session enregistrée pour le moment
        </p>
      ) : (
        <ul className="space-y-3">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(session.session_date)}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <LuFileText className="text-sm" />
                    {session.pages_read} pages
                  </span>
                  {session.duration_minutes !== null && (
                    <span className="flex items-center gap-1">
                      <LuClock className="text-sm" />
                      {session.duration_minutes} min
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}