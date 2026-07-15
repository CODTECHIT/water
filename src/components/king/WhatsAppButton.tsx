import { MessageCircle } from "lucide-react";

const WHATSAPP =
  "https://wa.me/919999999999?text=Hi%20King%20Water%2C%20I%27d%20like%20to%20order.";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-plum px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(142,42,107,0.55)] transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle size={16} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
