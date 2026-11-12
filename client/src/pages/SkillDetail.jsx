import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import SwapModal from "../components/SwapModal";
import StarRating from "../components/StarRating";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function SkillDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: skill, loading, error, reload } = useFetch(`/skills/${id}`);
  const [showModal, setShowModal] = useState(false);
  const [sent, setSent] = useState(false);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;
  if (!skill) return null;

  const isOwner = user && user._id === skill.owner._id;
  const isOffer = skill.type === "offer";

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/browse" className="text-sm font-medium text-ink-soft hover:text-ink">Back to browse</Link>
      <div className="mt-3 rounded-xl bg-white p-6 md:p-8">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isOffer ? "bg-teal/15 text-teal-dark" : "bg-sun/30"}`}>
          {isOffer ? "Can teach" : "Wants to learn"}
        </span>
        <h1 className="mt-3 text-4xl font-extrabold">{skill.title}</h1>
        <p className="mt-1 text-ink-soft">{skill.category} - {skill.level} - {skill.mode}</p>
        <p className="mt-5 whitespace-pre-line">{skill.description || "No description added."}</p>

        <div className="mt-6 flex items-center gap-3 rounded-lg bg-mist p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-bold text-white">{skill.owner.name[0]}</div>
          <div>
            <Link to={`/users/${skill.owner._id}`} className="font-bold hover:text-teal-dark">{skill.owner.name}</Link>
            <div className="text-sm text-ink-soft">
              {skill.owner.location || "Location not shared"}
              {skill.owner.ratingCount > 0 && <> - <StarRating value={skill.owner.ratingAvg} size="text-sm" /> ({skill.owner.ratingCount})</>}
            </div>
          </div>
        </div>

        {/* Conditional rendering based on login state and ownership */}
        <div className="mt-6">
          {sent ? (
            <p className="rounded-lg bg-teal/15 p-3 font-medium text-teal-dark">
              Request sent. Track it on your <Link to="/requests" className="underline">requests page</Link>.
            </p>
          ) : isOwner ? (
            <p className="text-sm text-ink-soft">This is your listing. Edit it from <Link to="/my-skills" className="font-bold underline">My skills</Link>.</p>
          ) : user ? (
            <button onClick={() => setShowModal(true)} className="rounded-lg bg-teal px-6 py-3 font-bold text-white hover:bg-teal-dark">
              {isOffer ? `Ask ${skill.owner.name.split(" ")[0]} to teach this` : `Offer to teach ${skill.owner.name.split(" ")[0]}`}
            </button>
          ) : (
            <Link to="/login" state={{ from: `/skills/${id}` }} className="inline-block rounded-lg bg-ink px-6 py-3 font-bold text-white">Log in to propose a swap</Link>
          )}
        </div>
      </div>

      {showModal && <SwapModal skill={skill} onClose={() => setShowModal(false)} onSent={() => { setShowModal(false); setSent(true); }} />}
    </div>
  );
}
