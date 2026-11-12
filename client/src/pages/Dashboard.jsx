import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const statusStyle = {
  pending: "bg-sun/30",
  accepted: "bg-teal/15 text-teal-dark",
  declined: "bg-red-100 text-red-800",
  completed: "bg-ink text-white",
};

export default function Dashboard() {
  const { user } = useAuth();
  const skills = useFetch("/skills/mine");
  const swaps = useFetch("/swaps");

  if (skills.loading || swaps.loading) return <Loader />;
  const error = skills.error || swaps.error;
  if (error) return <ErrorMessage message={error} onRetry={() => { skills.reload(); swaps.reload(); }} />;

  const mySkills = skills.data;
  const mySwaps = swaps.data;
  const incoming = mySwaps.filter((s) => s.receiver._id === user._id && s.status === "pending");
  const active = mySwaps.filter((s) => s.status === "accepted");
  const done = mySwaps.filter((s) => s.status === "completed");

  const stats = [
    ["Skills you listed", mySkills.length, "/my-skills"],
    ["Requests waiting for you", incoming.length, "/requests"],
    ["Swaps in progress", active.length, "/requests"],
    ["Swaps completed", done.length, "/requests"],
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Hi, {user.name.split(" ")[0]}</h1>
      <p className="mb-6 text-ink-soft">Here is what is happening with your swaps.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, n, to]) => (
          <Link key={label} to={to} className="rounded-xl bg-white p-5 hover:ring-2 hover:ring-teal">
            <p className="font-display text-4xl font-extrabold">{n}</p>
            <p className="text-sm text-ink-soft">{label}</p>
          </Link>
        ))}
      </div>

      {mySkills.length === 0 && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-sun bg-white p-6">
          <p className="font-bold">You have not listed any skills yet.</p>
          <p className="text-sm text-ink-soft">Add one skill you can teach and one you want to learn to start getting matches.</p>
          <Link to="/my-skills" className="mt-3 inline-block rounded-lg bg-teal px-5 py-2 font-bold text-white">Add your first skill</Link>
        </div>
      )}

      <h2 className="mb-3 mt-8 text-xl font-extrabold">Recent activity</h2>
      {mySwaps.length === 0 ? (
        <p className="text-ink-soft">No swap requests yet. Check your <Link className="font-bold underline" to="/matches">matches</Link>.</p>
      ) : (
        <ul className="space-y-3">
          {mySwaps.slice(0, 5).map((s) => {
            const mine = s.requester._id === user._id;
            const other = mine ? s.receiver : s.requester;
            return (
              <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-4">
                <span>
                  {mine ? "You offered" : `${other.name} offered`} <b>{s.offeredSkill}</b> for <b>{s.requestedSkill}</b>
                  {mine && <> with {other.name}</>}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[s.status]}`}>{s.status}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
