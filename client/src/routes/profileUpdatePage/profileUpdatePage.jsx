import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container py-12 max-w-4xl">
      <div className="bg-white rounded-card shadow-elevated overflow-hidden flex flex-col md:flex-row">
        {/* Form Side */}
        <div className="flex-1 p-8 lg:p-10">
          <h1 className="font-heading text-heading text-navy-900 mb-6">Update Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="label-text mb-1 block">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={currentUser.username}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="label-text mb-1 block">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={currentUser.email}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-text mb-1 block">New Password (leave blank to keep current)</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            {error && <p className="text-red-500 text-body-sm">{error}</p>}
            <div className="flex items-center gap-4 pt-2">
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Avatar Side */}
        <div className="w-full md:w-80 bg-surface-100 p-8 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-surface-200">
          <img
            src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
            alt="Profile Avatar"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-card mb-4"
          />
          <p className="font-body text-body-sm text-navy-600 mb-4">Upload a profile picture</p>
          <UploadWidget
            uwConfig={{
              cloudName: "dvigd3hvc",
              uploadPreset: "estatehub",
              multiple: false,
              maxImageFileSize: 2000000,
              folder: "avatars",
            }}
            setState={setAvatar}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
