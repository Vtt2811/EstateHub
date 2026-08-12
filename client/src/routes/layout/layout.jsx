import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CompareBar from "../../components/compareBar/CompareBar";

function Layout() {
  return (
    <div className="layout min-h-screen flex flex-col bg-surface-50">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <CompareBar />
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  else {
    return (
      <div className="layout min-h-screen flex flex-col bg-surface-50">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <CompareBar />
      </div>
    );
  }
}

function RequireAdmin() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.role !== "ADMIN") return <Navigate to="/" />;

  return (
    <div className="layout min-h-screen flex flex-col bg-surface-50">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <CompareBar />
    </div>
  );
}

export { Layout, RequireAuth, RequireAdmin };
