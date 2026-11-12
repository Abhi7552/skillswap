import { useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { validateProfile } from "../utils/validators";
import FormField from "../components/FormField";
import ErrorMessage from "../components/ErrorMessage";
import StarRating from "../components/StarRating";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, bio: user.bio || "", location: user.location || "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateProfile(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    setServerError("");
    try {
      const data = await api("/users/profile", { method: "PUT", body: form });
      setUser(data.user);
      setSaved(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-1 text-3xl font-extrabold">Your profile</h1>
      <p className="mb-5 text-sm text-ink-soft">
        {user.email} - {user.ratingCount > 0 ? <><StarRating value={user.ratingAvg} size="text-sm" /> {user.ratingAvg.toFixed(1)} ({user.ratingCount})</> : "No ratings yet"}
      </p>
      <ErrorMessage message={serverError} />
      {saved && <p className="mb-3 rounded-lg bg-teal/15 p-3 font-medium text-teal-dark" role="status">Profile saved.</p>}
      <form onSubmit={handleSubmit} noValidate className="mt-3 rounded-xl bg-white p-6">
        <FormField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField label="Location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Jalandhar" />
        <FormField as="textarea" rows={4} label="Bio" name="bio" value={form.bio} onChange={handleChange} error={errors.bio}
          hint={`${form.bio.length}/300`} placeholder="Tell people a little about yourself" />
        <button disabled={saving} className="rounded-lg bg-teal px-6 py-2.5 font-bold text-white hover:bg-teal-dark disabled:opacity-60">
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
