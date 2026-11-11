import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Account created! Welcome, " + data.user.username);
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <h2>Register</h2>
      <p>Create an account to save your scan history</p>
      <div className="card">
        <div className="form-group">
          <label>Username</label>
          <input name="username" placeholder="coolhacker" value={form.username} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </div>
      <div className="auth-link">Already have one? <Link to="/login">Sign in</Link></div>
    </div>
  );
}
