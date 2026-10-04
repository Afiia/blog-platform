import { Link, NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">BlogSpace</Link>
          <nav>
            {user ? (
              <>
                <span className="muted">Hi, {user.name}</span>
                <NavLink to="/new" className="btn btn-ghost">Write</NavLink>
                <button className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }}>Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost">Log in</NavLink>
                <NavLink to="/register" className="btn btn-ghost">Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="wrap"><Outlet /></main>
    </>
  );
}

export function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <p className="muted">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}
