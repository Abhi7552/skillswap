// Reusable labelled input / textarea / select with inline validation message.
export default function FormField({ label, name, error, as = "input", children, hint, ...rest }) {
  const Tag = as;
  const base =
    "w-full rounded-lg border bg-white px-3 py-2 text-ink placeholder:text-ink-soft/60 " +
    (error ? "border-red-500" : "border-line");
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-medium">{label}</label>
      <Tag id={name} name={name} className={base} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined} {...rest}>
        {children}
      </Tag>
      {hint && !error && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
      {error && <p id={`${name}-err`} className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}
