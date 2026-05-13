import { useEffect, useState } from "react";
import { userApi, type UserProfile } from "../services/userApi";
import ProfileHeader from "../components/profile/ProfileHeader";
import YearlyGoalSection from "../components/profile/YearlyGoalSection";
import ProfileHub from "../components/profile/ProfileHub";
import DeleteAccountSection from "../components/profile/DeleteAccountSection";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userApi
      .getProfile()
      .then((data) => {
        setUser(data);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Erreur de chargement";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function handleGoalUpdated(newGoal: number) {
    if (user) {
      setUser({ ...user, yearly_goal_books: newGoal });
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <p className="text-gray-500" role="status">
          Chargement...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <p className="text-red-600" role="alert">
          {error || "Profil introuvable"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <ProfileHeader
        user={user}
        onDisplayNameUpdated={(newName) => {
          if (user) setUser({ ...user, display_name: newName });
        }}
      />

      <YearlyGoalSection
        currentGoal={user.yearly_goal_books}
        onGoalUpdated={handleGoalUpdated}
      />

      <ProfileHub />

      <DeleteAccountSection />
    </div>
  );
}
