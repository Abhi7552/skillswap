import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validators";
import FormField from "../components/FormField";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // already logged in
  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateLogin(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    setServerError("");
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 md:p-8">
      <h1 className="mb-1 text-3xl font-extrabold">Welcome back</h1>
      <p className="mb-6 text-sm text-ink-soft">Log in to see your matches and requests.</p>
      <ErrorMessage message={serverError} />
      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
        <button disabled={submitting} className="w-full rounded-lg bg-teal py-3 font-bold text-white hover:bg-teal-dark disabled:opacity-60">
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        New here? <Link to="/register" className="font-bold text-teal-dark hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
