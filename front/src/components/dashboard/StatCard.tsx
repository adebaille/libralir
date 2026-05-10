import type { IconType } from "react-icons";

type StatCardProps = {
  icon: IconType;
  label: string;
  value: string | number;
  goal?: number;
};

export default function StatCard({ icon: Icon, label, value, goal }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        <Icon className="text-lg" />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-serif text-3xl font-semibold text-gray-900">
        {value}
        {goal !== undefined && (
          <span className="text-lg font-normal text-gray-400"> / {goal}</span>
        )}
      </p>
    </div>
  );
}