import { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SwapModal from "../components/SwapModal";
import StarRating from "../components/StarRating";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function Matches() {
  const { data: matches, loading, error, reload } = useFetch("/users/matches");
  const [active, setActive] = useState(null); // skill chosen for the swap modal
  const [notice, setNotice] = useState("");

  if (loading) return <Loader label="Finding your matches..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Your matches</h1>
      <p className="mb-6 text-ink-soft">People who can teach what you want to learn. Mutual matches also want something you offer.</p>
      {notice && <p className="mb-4 rounded-lg bg-teal/15 p-3 font-medium text-teal-dark" role="status">{notice}</p>}

      {matches.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center">
          <p className="font-bold">No matches yet.</p>
          <p className="mt-1 text-ink-soft">Add a skill you want to learn so we can find teachers for you.</p>
          <Link to="/my-skills" className="mt-4 inline-block rounded-lg bg-teal px-5 py-2 font-bold text-white">Add a skill</Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((m) => (
            <article key={m.user._id} className={`rounded-xl bg-white p-5 ${m.mutual ? "ring-2 ring-sun" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link to={`/users/${m.user._id}`} className="text-lg font-extrabold hover:text-teal-dark">{m.user.name}</Link>
                  <p className="text-sm text-ink-soft">{m.user.location || "Location not shared"}</p>
                  {m.user.ratingCount > 0 && <StarRating value={m.user.ratingAvg} size="text-sm" />}
                </div>
                {m.mutual && <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold">Mutual match</span>}
              </div>

              <p className="mt-4 text-sm"><b>Can teach you:</b> {m.canTeachMe.map((s) => s.title).join(", ")}</p>
              {m.wantsFromMe.length > 0 && <p className="mt-1 text-sm"><b>Wants to learn from you:</b> {m.wantsFromMe.map((s) => s.title).join(", ")}</p>}

              <button onClick={() => setActive(m.canTeachMe[0])} className="mt-4 rounded-lg bg-teal px-4 py-2 font-bold text-white hover:bg-teal-dark">
                Propose a swap
              </button>
            </article>
          ))}
        </div>
      )}

      {active && (
        <SwapModal skill={active} onClose={() => setActive(null)}
          onSent={() => { setActive(null); setNotice("Request sent. Track it on your requests page."); }} />
      )}
    </div>
  );
}
