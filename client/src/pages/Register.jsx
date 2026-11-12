import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateRegister } from "../utils/validators";
import FormField from "../components/FormField";
import ErrorMessage from "../components/ErrorMessage";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateRegister(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    setServerError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/my-skills", { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 md:p-8">
      <h1 className="mb-1 text-3xl font-extrabold">Create your account</h1>
      <p className="mb-6 text-sm text-ink-soft">It takes a minute. Then add the skills you can teach.</p>
      <ErrorMessage message={serverError} />
      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <FormField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} hint="At least 6 characters" autoComplete="new-password" />
        <FormField label="Confirm password" name="confirm" type="password" value={form.confirm} onChange={handleChange} error={errors.confirm} autoComplete="new-password" />
        <button disabled={submitting} className="w-full rounded-lg bg-teal py-3 font-bold text-white hover:bg-teal-dark disabled:opacity-60">
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        Already a member? <Link to="/login" className="font-bold text-teal-dark hover:underline">Log in</Link>
      </p>
    </div>
  );
}
