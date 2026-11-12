import { Link } from "react-router-dom";

// Props: skill (object), children (optional action buttons)
export default function SkillCard({ skill, children }) {
  const isOffer = skill.type === "offer";
  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isOffer ? "bg-teal/15 text-teal-dark" : "bg-sun/30 text-ink"}`}>
          {isOffer ? "Can teach" : "Wants to learn"}
        </span>
        <span className="text-xs text-ink-soft">{skill.mode}</span>
      </div>

      <h3 className="text-lg font-extrabold leading-tight">
        <Link to={`/skills/${skill._id}`} className="hover:text-teal-dark">{skill.title}</Link>
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{skill.category} - {skill.level}</p>

      {skill.description && <p className="mt-3 line-clamp-3 text-sm">{skill.description}</p>}

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        {skill.owner?.name ? (
          <Link to={`/users/${skill.owner._id}`} className="text-sm font-medium text-ink-soft hover:text-ink">
            {skill.owner.name}
            {skill.owner.location ? `, ${skill.owner.location}` : ""}
          </Link>
        ) : <span />}
        {children}
      </div>
    </article>
  );
}
