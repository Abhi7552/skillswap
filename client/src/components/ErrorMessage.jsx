// Props: message (string), onRetry (optional function)
export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="rounded-md bg-red-700 px-3 py-1 font-medium text-white hover:bg-red-800">
          Try again
        </button>
      )}
    </div>
  );
}
