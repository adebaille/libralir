import { useEffect } from "react";
import { LuCircleCheck } from "react-icons/lu";

type SuccessToastProps = {
  message: string;
  onClose: () => void;
};

export default function SuccessToast({ message, onClose }: SuccessToastProps) {
  // Disparaît automatiquement après 3 secondes
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg animate-slide-up"
    >
      <LuCircleCheck className="text-xl" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}