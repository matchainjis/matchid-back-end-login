// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getToken } from "../utils/storage";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const userRedux = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Invalid token format", err);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully 👋");
    navigate("/");
  };

  try {
  if (!userRedux?.isAuthenticated) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-100 p-4">
      <div className="flex justify-between items-center w-full max-w-xl mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">
          🎉 Dashboard
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full space-y-4 text-gray-500">
        <div>
          <h3 className="text-lg font-semibold text-gray-500">🧑 User Info</h3>
          <p>
            <strong>Email:</strong> {userRedux.email || "N/A"}
          </p>
          <p>
            <strong>Mobile:</strong> {userRedux.mobile || "N/A"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            🔗 Wallet Info
          </h3>
          <p>
            <strong>MatchID Address:</strong> {userRedux.matchidAddress}
          </p>
          <p>
            <strong>Extra EVM Address:</strong> {userRedux.extraEvmAddress}
          </p>
        </div>
      </div>
    </div>
  );
} catch (e) {
  console.error("Dashboard render error: ", e);
  return <p> Error loading dashboard. </p>
}
};

export default Dashboard;
