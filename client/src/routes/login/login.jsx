import React, { useContext, useState } from 'react';
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import Notification from "../../components/notification/Notification";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", { username, password });
      updateUser(res.data);
      setNotification({ message: "Login successful!", type: "success", visible: true });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials";
      setNotification({ message: msg, type: "error", visible: true });
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 bg-surface-50">
      <div className="w-full max-w-4xl bg-white rounded-card shadow-elevated overflow-hidden flex flex-col md:flex-row">
        {/* Left Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="font-heading text-display-sm text-navy-900 mb-2">Welcome Back</h1>
            <p className="text-navy-400 font-body text-body-sm">Sign in to manage your properties and chats</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text mb-1 block">Username</label>
              <input
                name="username"
                required
                minLength={3}
                maxLength={20}
                type="text"
                placeholder="Enter your username"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text mb-1 block">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <div className="text-red-500 text-body-sm">
                <p>{error}</p>
                {error === 'Please verify your email before logging in.' && (
                  <div className="flex flex-col gap-2 mt-3">
                    <Link to="/verify-email" className="text-accent-600 font-semibold hover:underline inline-block">
                      Verify / Resend Email
                    </Link>
                    <Link to="/update-email" className="text-accent-600 font-semibold hover:underline inline-block">
                      Entered wrong email? Update it here
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button disabled={isLoading} className="btn-primary w-full !py-3.5">
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-navy-500 font-body text-body-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent-600 font-semibold hover:underline">
              Create one now
            </Link>
          </p>
        </div>

        {/* Right Hero Side */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-accent-500/5 backdrop-blur-3xl" />
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="EstateHub Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                Estate<span className="text-accent-400">Hub</span>
              </span>
            </Link>
          </div>
          <div className="relative z-10 space-y-4 my-auto py-8">
            <h2 className="font-heading text-display-sm text-white leading-tight">
              Unlock Exclusive <span className="text-accent-400">Properties</span>
            </h2>
            <p className="text-navy-300 font-body text-body-sm leading-relaxed">
              Connect directly with verified buyers, renters, and top agents across the region with total transparency.
            </p>
          </div>
          <div className="relative z-10 text-caption text-navy-400 font-body">
            © {new Date().getFullYear()} EstateHub Inc.
          </div>
        </div>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
}

export default Login;
