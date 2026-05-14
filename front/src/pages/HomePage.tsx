import { useEffect, useState } from "react";
import { statsApi, type DashboardStats } from "../services/statsApi";
import { libraryApi, type LibraryBook } from "../services/libraryApi";
import Greeting from "../components/dashboard/Greeting";
import StatsGrid from "../components/dashboard/StatsGrid";
import InProgressBooks from "../components/dashboard/InProgressBooks";
import StreakDisplay from "../components/dashboard/StreakDisplay";

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inProgressBooks, setInProgressBooks] = useState<LibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, booksData] = await Promise.all([
          statsApi.getDashboardStats(),
          libraryApi.getLibrary({ status: "in_progress" }),
        ]);
        setStats(statsData);
        setInProgressBooks(booksData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur de chargement";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Greeting />

      {isLoading && (
        <p className="text-gray-500" role="status">
          Chargement...
        </p>
      )}

      {error && (
        <p className="text-red-600" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && stats && (
        <>
          <StreakDisplay currentStreak={stats.current_streak} />
          <div className="mb-8">
            <StatsGrid stats={stats} />
          </div>
          <InProgressBooks books={inProgressBooks} />
        </>
      )}
    </div>
  );
}