import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">PHISH<span>GUARD</span></Link>
      <div className="navbar-links">
        <Link to="/">Scanner</Link>
        {token && <Link to="/history">History</Link>}
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ color: "#5a6a88", fontSize: "0.85rem" }}>{user?.username}</span>
            <button className="btn-logout" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
