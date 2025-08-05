import { useEffect } from "react";

interface FeedbackModalProps {
  message: string;
  onClose: () => void;
}

export function FeedbackModal({ message, onClose }: FeedbackModalProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="flex justify-center items-center bg-white px-6 py-4 rounded-lg shadow-lg h-30 w-150">
        <p className="text-lg font-semibold text-gray-700">{message}</p>
      </div>
    </div>
  );
}
