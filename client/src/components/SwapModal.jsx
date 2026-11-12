import { useEffect, useState } from "react";
import { api } from "../api/api";
import { validateSwap } from "../utils/validators";
import FormField from "./FormField";
import ErrorMessage from "./ErrorMessage";

// Props: skill (the skill being requested, with owner), onClose, onSent
// If the skill is an "offer", the user asks to learn it and picks what they will teach in return.
// If it is a "want", the user offers to teach it and says what they want to learn back.
export default function SwapModal({ skill, onClose, onSent }) {
  const isOffer = skill.type === "offer";
  const [form, setForm] = useState({
    offeredSkill: isOffer ? "" : skill.title,
    requestedSkill: isOffer ? skill.title : "",
    message: "",
  });
  const [mySkills, setMySkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [sending, setSending] = useState(false);

  // Load my own skills to suggest in the form
  useEffect(() => {
    api("/skills/mine").then(setMySkills).catch(() => setMySkills([]));
  }, []);

  const suggestions = mySkills.filter((s) => s.type === (isOffer ? "offer" : "want")).map((s) => s.title);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateSwap(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSending(true);
    setServerError("");
    try {
      await api("/swaps", { method: "POST", body: { receiver: skill.owner._id, ...form } });
      onSent();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" role="dialog" aria-modal="true" aria-labelledby="swap-title">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6">
        <h2 id="swap-title" className="mb-1 text-2xl font-extrabold">Propose a swap with {skill.owner.name}</h2>
        <p className="mb-4 text-sm text-ink-soft">They will see your message and can accept or decline.</p>

        <ErrorMessage message={serverError} />
        <form onSubmit={handleSubmit} noValidate className="mt-3">
          <FormField label="I will teach" name="offeredSkill" value={form.offeredSkill} onChange={handleChange}
            error={errors.offeredSkill} readOnly={!isOffer} list="my-skills" placeholder="e.g. Python" />
          <FormField label="I want to learn" name="requestedSkill" value={form.requestedSkill} onChange={handleChange}
            error={errors.requestedSkill} readOnly={isOffer} list="my-skills" placeholder="e.g. Guitar" />
          <datalist id="my-skills">{suggestions.map((s) => <option key={s} value={s} />)}</datalist>
          <FormField as="textarea" rows={3} label="Message (optional)" name="message" value={form.message}
            onChange={handleChange} error={errors.message} placeholder="Say hi and suggest a time" />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-line px-4 py-2 font-medium">Cancel</button>
            <button disabled={sending} className="rounded-lg bg-teal px-4 py-2 font-bold text-white hover:bg-teal-dark disabled:opacity-60">
              {sending ? "Sending..." : "Send request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
