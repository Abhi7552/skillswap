// Display (value) or input (onChange) star rating
export default function StarRating({ value = 0, onChange, size = "text-lg" }) {
  return (
    <span className={`inline-flex ${size}`} aria-label={`${Number(value).toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const star = <span className={filled ? "text-sun" : "text-line"}>★</span>;
        return onChange ? (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>{star}</button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </span>
  );
}
