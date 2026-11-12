import { useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import StarRating from "../components/StarRating";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const statusStyle = {
  pending: "bg-sun/30",
  accepted: "bg-teal/15 text-teal-dark",
  declined: "bg-red-100 text-red-800",
  completed: "bg-ink text-white",
};

// Child component with its own state: rating form for a completed swap
function ReviewForm({ swapId, onDone, onError }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setErr("Choose a star rating first.");
    setBusy(true);
    try {
      await api(`/swaps/${swapId}/review`, { method: "POST", body: { rating, comment } });
      onDone();
    } catch (error) {
      onError(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 rounded-lg bg-mist p-3">
      <p className="mb-1 text-sm font-bold">Rate this swap</p>
      <StarRating value={rating} onChange={setRating} size="text-2xl" />
      <input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={300} placeholder="Add a short comment (optional)"
        aria-label="Comment" className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" />
      {err && <p className="mt-1 text-sm text-red-700">{err}</p>}
      <button disabled={busy} className="mt-2 rounded-lg bg-ink px-4 py-1.5 text-sm font-bold text-white disabled:opacity-60">Submit rating</button>
    </form>
  );
}

export default function Requests() {
  const { user } = useAuth();
  const { data: swaps, loading, error, reload } = useFetch("/swaps");
  const [tab, setTab] = useState("received");
  const [actionError, setActionError] = useState("");

  const updateStatus = async (id, status) => {
    setActionError("");
    try {
      await api(`/swaps/${id}/status`, { method: "PUT", body: { status } });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const received = swaps.filter((s) => s.receiver._id === user._id);
  const sent = swaps.filter((s) => s.requester._id === user._id);
  const list = tab === "received" ? received : sent;

  const tabBtn = (key, label, count) => (
    <button onClick={() => setTab(key)} aria-pressed={tab === key}
      className={`rounded-lg px-4 py-2 font-bold ${tab === key ? "bg-ink text-white" : "bg-white"}`}>
      {label} ({count})
    </button>
  );

  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold">Swap requests</h1>
      <div className="mb-5 flex gap-2">{tabBtn("received", "Received", received.length)}{tabBtn("sent", "Sent", sent.length)}</div>
      <ErrorMessage message={actionError} />

      {list.length === 0 ? (
        <div className="mt-3 rounded-xl bg-white p-10 text-center text-ink-soft">
          {tab === "received" ? "No one has asked you for a swap yet." : "You have not sent any requests yet. Try your matches page."}
        </div>
      ) : (
        <ul className="mt-3 space-y-4">
          {list.map((s) => {
            const other = tab === "received" ? s.requester : s.receiver;
            const iReviewed = s.reviews.some((r) => r.reviewer._id === user._id);
            return (
              <li key={s._id} className="rounded-xl bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-extrabold">{other.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[s.status]}`}>{s.status}</span>
                </div>
                <p className="mt-2 text-sm">
                  {tab === "received" ? `${other.name} will teach you` : "You will teach"} <b>{s.offeredSkill}</b>
                  {" "}in exchange for <b>{s.requestedSkill}</b>.
                </p>
                {s.message && <p className="mt-2 rounded-lg bg-mist p-3 text-sm italic">"{s.message}"</p>}

                <div className="mt-3 flex flex-wrap gap-2">
                  {s.status === "pending" && tab === "received" && (
                    <>
                      <button onClick={() => updateStatus(s._id, "accepted")} className="rounded-lg bg-teal px-4 py-1.5 text-sm font-bold text-white">Accept</button>
                      <button onClick={() => updateStatus(s._id, "declined")} className="rounded-lg border border-red-600 px-4 py-1.5 text-sm font-bold text-red-700">Decline</button>
                    </>
                  )}
                  {s.status === "pending" && tab === "sent" && <span className="text-sm text-ink-soft">Waiting for {other.name} to reply.</span>}
                  {s.status === "accepted" && (
                    <button onClick={() => updateStatus(s._id, "completed")} className="rounded-lg bg-ink px-4 py-1.5 text-sm font-bold text-white">Mark as completed</button>
                  )}
                </div>

                {s.status === "completed" && !iReviewed && (
                  <ReviewForm swapId={s._id} onDone={reload} onError={setActionError} />
                )}
                {s.status === "completed" && iReviewed && <p className="mt-3 text-sm text-ink-soft">You have rated this swap.</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
