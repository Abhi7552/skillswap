import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const link = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-white/15 text-white" : "text-white/80 hover:text-white"}`;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const close = () => setOpen(false);

  return (
    <header className="bg-ink">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main">
        <Link to="/" className="font-display text-xl font-extrabold text-white" onClick={close}>
          Skill<span className="text-sun">Swap</span>
        </Link>

        <button className="rounded-md p-2 text-white md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
          {open ? "✕" : "☰"}
        </button>

        <div className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-14 z-10 flex-col gap-1 bg-ink px-4 pb-4 md:static md:flex md:flex-row md:items-center md:bg-transparent md:p-0`}>
          <NavLink to="/browse" className={link} onClick={close}>Browse skills</NavLink>
          {/* Conditional rendering: different links for guests and members */}
          {user ? (
            <>
              <NavLink to="/dashboard" className={link} onClick={close}>Dashboard</NavLink>
              <NavLink to="/matches" className={link} onClick={close}>Matches</NavLink>
              <NavLink to="/my-skills" className={link} onClick={close}>My skills</NavLink>
              <NavLink to="/requests" className={link} onClick={close}>Requests</NavLink>
              <NavLink to="/profile" className={link} onClick={close}>{user.name.split(" ")[0]}</NavLink>
              <button onClick={handleLogout} className="rounded-md border border-white/30 px-3 py-2 text-sm text-white hover:bg-white/10 md:ml-2">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={link} onClick={close}>Log in</NavLink>
              <Link to="/register" onClick={close} className="rounded-md bg-sun px-4 py-2 text-sm font-bold text-ink hover:brightness-95 md:ml-2">
                Join free
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
