type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
};

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div
      role="tablist"
      className="flex border-b border-gray-200 mb-6"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 py-3 px-4 text-sm font-medium transition-colors
              border-b-2 -mb-px
              ${
                isActive
                  ? "border-violet-500 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}