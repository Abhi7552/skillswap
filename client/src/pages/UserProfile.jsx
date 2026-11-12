import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkillCard from "../components/SkillCard";
import StarRating from "../components/StarRating";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function UserProfile() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(`/users/${id}`);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const { user, skills } = data;
  const offers = skills.filter((s) => s.type === "offer").map((s) => ({ ...s, owner: { _id: user._id, name: user.name } }));
  const wants = skills.filter((s) => s.type === "want").map((s) => ({ ...s, owner: { _id: user._id, name: user.name } }));

  return (
    <div>
      <div className="mb-8 rounded-xl bg-white p-6">
        <h1 className="text-3xl font-extrabold">{user.name}</h1>
        <p className="text-ink-soft">{user.location || "Location not shared"}</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          {user.ratingCount > 0 ? (<><StarRating value={user.ratingAvg} /> <span>{user.ratingAvg.toFixed(1)} from {user.ratingCount} rating{user.ratingCount > 1 ? "s" : ""}</span></>) : <span className="text-ink-soft">No ratings yet</span>}
        </div>
        {user.bio && <p className="mt-3 max-w-xl">{user.bio}</p>}
      </div>

      <h2 className="mb-3 text-xl font-extrabold">Can teach</h2>
      {offers.length === 0 ? <p className="mb-8 text-ink-soft">Nothing listed yet.</p> : (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{offers.map((s) => <SkillCard key={s._id} skill={s} />)}</div>
      )}
      <h2 className="mb-3 text-xl font-extrabold">Wants to learn</h2>
      {wants.length === 0 ? <p className="text-ink-soft">Nothing listed yet.</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{wants.map((s) => <SkillCard key={s._id} skill={s} />)}</div>
      )}
    </div>
  );
}
