import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/User"; // import logout action

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.authinfo);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // redirect to home after logout
  };

  return (
    <nav className="fixed z-10 top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-sm text-white">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-bold tracking-wide">
          GV <span className="text-blue-400">Crackers</span>
        </h1>
      </Link>

      {/* Login / Logout Button */}
      {auth?.isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="px-5 py-2 rounded-lg bg-white/90 text-black font-semibold hover:bg-blue-500 hover:text-white transition"
        >
          Login
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
