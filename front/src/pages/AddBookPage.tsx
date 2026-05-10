import { useState } from "react";
import Tabs from "../components/ui/Tabs";
import SuccessToast from "../components/ui/SuccessToast";
import SearchTab from "../components/library/SearchTab";
import ManualTab from "../components/library/ManualTab";

const TABS = [
  { id: "search", label: "Rechercher" },
  { id: "manual", label: "Saisie manuelle" },
];

export default function AddBookPage() {
  const [activeTab, setActiveTab] = useState<string>("search");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleBookAdded() {
    setSuccessMessage("Livre ajouté à votre bibliothèque");
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-6">
        Ajouter un livre
      </h1>

      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "search" && <SearchTab onBookAdded={handleBookAdded} />}
      {activeTab === "manual" && <ManualTab onBookAdded={handleBookAdded} />}

      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}