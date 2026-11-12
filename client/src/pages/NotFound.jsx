import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-ink-soft">That page does not exist or has moved.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-teal px-6 py-3 font-bold text-white">Go to home page</Link>
    </div>
  );
}
