import React, { useState, useContext, useEffect } from "react";
import { loginUser } from "../api/api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const navigate = useNavigate();
  const { fetchUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/";
  const messageFromRedirect = searchParams.get("message");

  useEffect(() => {
    if (messageFromRedirect) {
      setInfoMsg(decodeURIComponent(messageFromRedirect));
    }
  }, [messageFromRedirect]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await loginUser(form);

    if (result.token) {
      localStorage.setItem("authToken", result.token);
      await fetchUser(); // update global user state
      setForm({ email: "", password: "" });
      navigate(redirectPath); // Redirect to original page
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {infoMsg && <p className="message info">ℹ️ {infoMsg}</p>}
      {error && <p className="message error">❌ {error}</p>}

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
