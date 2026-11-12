import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import SkillCard from "../components/SkillCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function Home() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch("/skills?limit=3&type=offer");

  return (
    <div>
      <section className="grid items-center gap-10 py-6 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Trade what you know for what you want to learn.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Teach guitar, learn Python. Teach Punjabi, learn design. SkillSwap pairs you with someone who wants what you have,
            and has what you want.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {user ? (
              <Link to="/matches" className="rounded-lg bg-teal px-6 py-3 font-bold text-white hover:bg-teal-dark">See my matches</Link>
            ) : (
              <Link to="/register" className="rounded-lg bg-teal px-6 py-3 font-bold text-white hover:bg-teal-dark">Create free account</Link>
            )}
            <Link to="/browse" className="rounded-lg border-2 border-ink px-6 py-3 font-bold hover:bg-ink hover:text-white">Browse skills</Link>
          </div>
        </div>

        {/* Hero: two skill cards trading places */}
        <div className="relative mx-auto h-72 w-full max-w-md" aria-hidden="true">
          <div className="hero-card-a absolute left-0 top-2 w-60 rounded-xl border border-line bg-white p-5 shadow-sm">
            <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-bold text-teal-dark">Asha teaches</span>
            <p className="mt-4 font-display text-3xl font-extrabold">Python</p>
            <p className="mt-1 text-sm text-ink-soft">Programming - Advanced</p>
          </div>
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun px-4 py-3 text-2xl font-extrabold">⇄</div>
          <div className="hero-card-b absolute bottom-2 right-0 w-60 rounded-xl border border-line bg-white p-5 shadow-sm">
            <span className="rounded-full bg-sun/30 px-3 py-1 text-xs font-bold">Karan teaches</span>
            <p className="mt-4 font-display text-3xl font-extrabold">Guitar</p>
            <p className="mt-1 text-sm text-ink-soft">Music - Advanced</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">How a swap works</h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["List your skills", "Add what you can teach and what you want to learn."],
            ["Get matched", "We find people whose skills fit yours, mutual matches first."],
            ["Swap and rate", "Agree on a time, teach each other, then leave a rating."],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-xl bg-white p-5">
              <h3 className="font-extrabold">{i + 1}. {t}</h3>
              <p className="mt-1 text-sm text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Newly listed skills</h2>
          <Link to="/browse" className="text-sm font-bold text-teal-dark hover:underline">See all</Link>
        </div>
        {loading && <Loader />}
        <ErrorMessage message={error} onRetry={reload} />
        {data && data.skills.length === 0 && <p className="text-ink-soft">No skills listed yet. Be the first to add one.</p>}
        {data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.skills.map((s) => <SkillCard key={s._id} skill={s} />)}
          </div>
        )}
      </section>
    </div>
  );
}
