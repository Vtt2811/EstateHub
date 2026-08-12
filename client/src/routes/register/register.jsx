import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("BUYER");
  const [licenseDoc, setLicenseDoc] = useState([]);
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  // Password validation checks
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  const isValidPassword = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    // Validate agent license upload
    if (role === "AGENT" && licenseDoc.length === 0) {
      setError("Please upload your license or ID document before registering as an agent.");
      setIsLoading(false);
      return;
    }

    if (!isValidPassword) {
      setError("Please ensure your password meets all requirements.");
      setIsLoading(false);
      return;
    }

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
        role,
        licenseDocument: role === "AGENT" ? licenseDoc[0] : undefined,
      });

      setShowSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 bg-surface-50">
        <div className="w-full max-w-md bg-white rounded-card shadow-elevated p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h1 className="font-heading text-display-sm text-navy-900 mb-2">Check Your Email</h1>
          <p className="text-navy-600 mb-6">We've sent a verification link to your email address. Please verify your account before logging in.</p>
          <Link to="/login" className="btn-primary w-full block">Go to Login</Link>
        </div>
      </div>
    );
  }

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
              {/* Password strength checklist */}
              <div className="mt-2 text-xs grid grid-cols-2 gap-1 text-navy-500">
                <span className={hasLength ? "text-green-600" : ""}>{hasLength ? "✓" : "○"} 8+ characters</span>
                <span className={hasUpper ? "text-green-600" : ""}>{hasUpper ? "✓" : "○"} Uppercase</span>
                <span className={hasLower ? "text-green-600" : ""}>{hasLower ? "✓" : "○"} Lowercase</span>
                <span className={hasNumber ? "text-green-600" : ""}>{hasNumber ? "✓" : "○"} Number</span>
                <span className={hasSpecial ? "text-green-600" : ""}>{hasSpecial ? "✓" : "○"} Special character</span>
              </div>
              <p className="text-[10px] text-navy-400 mt-1">Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.</p>
            </div>

            {/* Role Selector */}
            <div>
              <label className="label-text mb-1 block">I am a…</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "BUYER", label: "🏠 Buyer", desc: "Find your dream home" },
                  { value: "SELLER", label: "💼 Seller", desc: "List your property" },
                  { value: "AGENT", label: "🏅 Agent", desc: "Professional agent" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-btn border-2 transition-all duration-250 cursor-pointer text-center
                      ${role === option.value
                        ? "border-accent-500 bg-accent-50 text-accent-700"
                        : "border-navy-200 bg-white text-navy-600 hover:border-navy-300"
                      }`}
                  >
                    <span className="text-xl">{option.label.split(" ")[0]}</span>
                    <span className="font-body font-semibold text-caption">{option.label.split(" ").slice(1).join(" ")}</span>
                    <span className="font-body text-[10px] text-navy-400 leading-tight">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Agent License Upload */}
            {role === "AGENT" && (
              <div className="bg-amber-50 border border-amber-200 rounded-btn p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
                  <p className="font-body text-body-sm text-amber-800">
                    <strong>Agent accounts require manual review.</strong> Your account will be activated once an admin verifies your license. You'll be able to post listings after approval.
                  </p>
                </div>
                <div>
                  <label className="label-text mb-2 block text-amber-800">Upload License / ID Document <span className="text-red-500">*</span></label>
                  {licenseDoc.length > 0 ? (
                    <div className="relative">
                      <img
                        src={licenseDoc[0]}
                        alt="License document"
                        className="w-full h-32 object-cover rounded-btn border border-amber-300"
                      />
                      <button
                        type="button"
                        onClick={() => setLicenseDoc([])}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                      <p className="mt-1 font-body text-caption text-green-700">✓ Document uploaded</p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-amber-300 rounded-btn p-4 text-center">
                      <UploadWidget
                        uwConfig={{
                          cloudName: "dvigd3hvc",
                          uploadPreset: "estatehub",
                          multiple: false,
                          maxImageFileSize: 5000000,
                          folder: "licenses",
                        }}
                        setState={setLicenseDoc}
                      />
                      <p className="mt-2 font-body text-caption text-navy-400">
                        JPG, PNG or PDF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-body-sm">{error}</p>}

            <button disabled={isLoading || !isValidPassword} className={`btn-primary w-full !py-3.5 ${(!isValidPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
              Find Your <span className="text-accent-400">Dream Space</span>
            </h2>
            <p className="text-navy-300 font-body text-body-sm leading-relaxed">
              Start your real estate journey today with thousands of verified listings updated in real time.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: "🏠", label: "Buyer", desc: "Browse & save listings" },
                { icon: "💼", label: "Seller", desc: "Post immediately" },
                { icon: "🏅", label: "Agent", desc: "Verified professionals" },
              ].map((r) => (
                <div key={r.label} className="bg-white/10 rounded-btn p-3 text-center backdrop-blur-sm">
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="font-body font-semibold text-caption text-white">{r.label}</div>
                  <div className="font-body text-[10px] text-navy-300 mt-0.5">{r.desc}</div>
                </div>
              ))}
            </div>
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
