import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
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
            <h1 className="font-heading text-display-sm text-navy-900 mb-2">Create Account</h1>
            <p className="text-navy-400 font-body text-body-sm">Join EstateHub to list properties or save favorites</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text mb-1 block">Username</label>
              <input
                name="username"
                type="text"
                required
                placeholder="Choose a username"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text mb-1 block">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
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

            {error && <p className="text-red-500 text-body-sm">{error}</p>}

            <button disabled={isLoading} className="btn-primary w-full !py-3.5">
              {isLoading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <p className="mt-8 text-center text-navy-500 font-body text-body-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Hero Side */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-accent-500/5 backdrop-blur-3xl" />
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-base leading-none">E</span>
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                Estate<span className="text-accent-400">Hub</span>
              </span>
            </Link>
          </div>
          <div className="relative z-10 space-y-4 my-auto py-8">
            <h2 className="font-heading text-display-sm text-white leading-tight">
              Find Your <span className="text-accent-400">Dream Space</span>
            </h2>
            <p className="text-navy-300 font-body text-body-sm leading-relaxed">
              Start your real estate journey today with thousands of verified listings updated in real time.
            </p>
          </div>
          <div className="relative z-10 text-caption text-navy-400 font-body">
            © {new Date().getFullYear()} EstateHub Inc.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
