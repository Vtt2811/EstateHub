import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';
import Notification from "../../components/notification/Notification";

function UpdateEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const newEmail = formData.get("newEmail");

    try {
      await apiRequest.post("/auth/update-email", { username, password, newEmail });
      setShowSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update email";
      setError(msg);
      setNotification({ message: msg, type: "error", visible: true });
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
          <h1 className="font-heading text-display-sm text-navy-900 mb-2">Email Updated!</h1>
          <p className="text-navy-600 mb-6">We've sent a new verification link to your updated email address. Please verify your account before logging in.</p>
          <Link to="/login" className="btn-primary w-full block">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 bg-surface-50">
      <div className="w-full max-w-md bg-white rounded-card shadow-elevated overflow-hidden p-8">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-display-sm text-navy-900 mb-2">Update Email</h1>
          <p className="text-navy-400 font-body text-body-sm">
            Entered the wrong email? Verify your credentials and update it here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-text mb-1 block">Username</label>
            <input
              name="username"
              required
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
          <div>
            <label className="label-text mb-1 block">New Email Address</label>
            <input
              name="newEmail"
              type="email"
              required
              placeholder="new@example.com"
              className="input-field"
            />
          </div>

          {error && <p className="text-red-500 text-body-sm">{error}</p>}

          <button disabled={isLoading} className="btn-primary w-full !py-3.5">
            {isLoading ? "Updating..." : "Update Email"}
          </button>
          
          <Link to="/login" className="btn-ghost w-full block text-center mt-2">
            Cancel
          </Link>
        </form>

        <Notification
          message={notification.message}
          type={notification.type}
          visible={notification.visible}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      </div>
    </div>
  );
}

export default UpdateEmailPage;
