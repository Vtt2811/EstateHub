import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await apiRequest.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/profile");
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/posts/update/${postId}`);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col lg:flex-row bg-surface-50">
      {/* Details Container */}
      <div className="flex-1 lg:w-3/5 p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* User Card */}
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-surface-200">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt={currentUser.username}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-accent-100"
              />
              <div>
                <h1 className="font-heading text-heading text-navy-900">{currentUser.username}</h1>
                <p className="text-navy-400 font-body text-body-sm">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link to="/profile/update" className="btn-outline flex-1 sm:flex-initial !py-2.5">
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="btn-ghost !text-red-600 hover:!bg-red-50 !py-2.5">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-navy-900">My Property Listings</h2>
            <Link to="/add" className="btn-primary !py-2 !px-4">
              + Add Property
            </Link>
          </div>
          <Suspense fallback={<div className="py-8 text-center text-navy-400">Loading listings...</div>}>
            <Await resolve={data.postResponse} errorElement={<p className="text-red-500">Error loading posts!</p>}>
              {(postResponse) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <List
                    posts={postResponse.data.userPosts}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    isMyListing={true}
                  />
                </div>
              )}
            </Await>
          </Suspense>
        </div>

        {/* Saved Listings */}
        <div className="space-y-4 pt-4">
          <h2 className="font-heading text-xl text-navy-900">Saved Properties</h2>
          <Suspense fallback={<div className="py-8 text-center text-navy-400">Loading saved properties...</div>}>
            <Await resolve={data.postResponse} errorElement={<p className="text-red-500">Error loading posts!</p>}>
              {(postResponse) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <List
                    posts={postResponse.data.savedPosts}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    isMyListing={false}
                  />
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="lg:w-2/5 bg-white border-l border-surface-200 min-h-[500px] lg:min-h-0 flex flex-col">
        <Suspense fallback={<div className="p-8 text-center text-navy-400">Loading chats...</div>}>
          <Await resolve={data.chatResponse} errorElement={<p className="p-8 text-red-500">Error loading chats!</p>}>
            {(chatResponse) => <Chat chats={chatResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ProfilePage;
