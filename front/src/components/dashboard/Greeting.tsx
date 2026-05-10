import { LuSun, LuMoon } from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";

export default function Greeting() {
  const { user } = useAuth();

  // Détermine le message et l'icône selon l'heure
  const hour = new Date().getHours();
  const isDaytime = hour >= 5 && hour < 18;

  const greetingText = isDaytime ? "Bonjour" : "Bonsoir";
  const Icon = isDaytime ? LuSun : LuMoon;
  const iconColor = isDaytime ? "text-gold-400" : "text-violet-400";

  return (
    <header className="mb-6">
      <div className="flex items-center gap-2 text-base text-gray-500 mb-1">
        <Icon className={`text-3xl ${iconColor}`} />
        <span>{greetingText}</span>
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900">
        {user?.display_name}
      </h1>
    </header>
  );
}