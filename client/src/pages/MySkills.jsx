import { useState } from "react";
import { api } from "../api/api";
import useFetch from "../hooks/useFetch";
import { validateSkill } from "../utils/validators";
import FormField from "../components/FormField";
import SkillCard from "../components/SkillCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = ["Programming", "Music", "Languages", "Design", "Cooking", "Fitness", "Academics", "Art", "Business", "Other"];
const EMPTY = { title: "", type: "offer", category: "Programming", level: "Beginner", mode: "Online", description: "" };

export default function MySkills() {
  const { data: skills, loading, error, reload } = useFetch("/skills/mine");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateSkill(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    setServerError("");
    try {
      if (editingId) await api(`/skills/${editingId}`, { method: "PUT", body: form });
      else await api("/skills", { method: "POST", body: form });
      reset();
      reload();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({ title: s.title, type: s.type, category: s.category, level: s.level, mode: s.mode, description: s.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await api(`/skills/${id}`, { method: "DELETE" });
      if (editingId === id) reset();
      reload();
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-1">
        <h1 className="mb-4 text-3xl font-extrabold">{editingId ? "Edit skill" : "Add a skill"}</h1>
        <ErrorMessage message={serverError} />
        <form onSubmit={handleSubmit} noValidate className="mt-3 rounded-xl bg-white p-5">
          <FormField as="select" label="I want to" name="type" value={form.type} onChange={handleChange}>
            <option value="offer">Teach this skill</option>
            <option value="want">Learn this skill</option>
          </FormField>
          <FormField label="Skill name" name="title" value={form.title} onChange={handleChange} error={errors.title} placeholder="e.g. Guitar" />
          <FormField as="select" label="Category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField as="select" label="Level" name="level" value={form.level} onChange={handleChange}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </FormField>
            <FormField as="select" label="Mode" name="mode" value={form.mode} onChange={handleChange}>
              <option>Online</option><option>In person</option><option>Both</option>
            </FormField>
          </div>
          <FormField as="textarea" rows={3} label="Description" name="description" value={form.description} onChange={handleChange}
            error={errors.description} hint={`${form.description.length}/500`} placeholder="What can you teach, or what do you want to learn?" />
          <div className="flex gap-2">
            <button disabled={saving} className="flex-1 rounded-lg bg-teal py-2.5 font-bold text-white hover:bg-teal-dark disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Save changes" : "Add skill"}
            </button>
            {editingId && <button type="button" onClick={reset} className="rounded-lg border border-line px-4 font-medium">Cancel</button>}
          </div>
        </form>
      </section>

      <section className="lg:col-span-2">
        <h2 className="mb-4 text-3xl font-extrabold">My skills</h2>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} onRetry={reload} />}
        {skills && skills.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center text-ink-soft">Nothing here yet. Use the form to add your first skill.</div>
        )}
        {skills && (
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((s) => (
              <SkillCard key={s._id} skill={s}>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => startEdit(s)} className="font-bold text-teal-dark hover:underline">Edit</button>
                  <button onClick={() => remove(s._id)} className="font-bold text-red-700 hover:underline">Delete</button>
                </div>
              </SkillCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
