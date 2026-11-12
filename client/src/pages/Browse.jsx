import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import SkillCard from "../components/SkillCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = ["Programming", "Music", "Languages", "Design", "Cooking", "Fitness", "Academics", "Art", "Business", "Other"];

export default function Browse() {
  const [filters, setFilters] = useState({ q: "", type: "", category: "", mode: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ skills: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const timer = useRef(null);

  // Debounce the search box so we don't call the API on every key press
  const handleSearch = (e) => {
    setSearch(e.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setFilters((f) => ({ ...f, q: e.target.value }));
      setPage(1);
    }, 400);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const setFilter = (name, value) => {
    setFilters((f) => ({ ...f, [name]: value }));
    setPage(1);
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ page, limit: 9 });
      Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
      try {
        const data = await api(`/skills?${params}`);
        if (!ignore) setResult(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [filters, page, retry]);

  const select = "rounded-lg border border-line bg-white px-3 py-2";

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Browse skills</h1>
      <p className="mb-5 text-ink-soft">{result.total} skill{result.total === 1 ? "" : "s"} listed</p>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input value={search} onChange={handleSearch} placeholder="Search skills, e.g. guitar" aria-label="Search skills" className={select} />
        <select value={filters.type} onChange={(e) => setFilter("type", e.target.value)} aria-label="Type" className={select}>
          <option value="">Teaching and learning</option>
          <option value="offer">Can teach</option>
          <option value="want">Wants to learn</option>
        </select>
        <select value={filters.category} onChange={(e) => setFilter("category", e.target.value)} aria-label="Category" className={select}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={filters.mode} onChange={(e) => setFilter("mode", e.target.value)} aria-label="Mode" className={select}>
          <option value="">Online or in person</option>
          <option>Online</option>
          <option>In person</option>
          <option>Both</option>
        </select>
      </div>

      <ErrorMessage message={error} onRetry={() => setRetry((r) => r + 1)} />
      {loading ? (
        <Loader />
      ) : result.skills.length === 0 && !error ? (
        <div className="rounded-xl bg-white p-10 text-center text-ink-soft">No skills match these filters. Try a different search.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.skills.map((s) => <SkillCard key={s._id} skill={s} />)}
        </div>
      )}

      {result.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-ink px-4 py-2 font-medium disabled:opacity-40">Previous</button>
          <span className="text-sm">Page {page} of {result.pages}</span>
          <button disabled={page >= result.pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-ink px-4 py-2 font-medium disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
