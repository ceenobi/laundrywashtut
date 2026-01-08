// Cookie Banner Component
export default function CookieBanner({ onDismiss }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold mb-1">Cookies are disabled</p>
          <p className="text-sm">
            Please enable cookies in your browser settings to use this
            application. Cookies are required for authentication and session
            management.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="px-4 py-2 bg-white text-yellow-600 rounded hover:bg-gray-100 font-semibold transition-colors whitespace-nowrap"
          aria-label="Dismiss cookie warning"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
