import React, { useState, useEffect } from "react";
import bg from "../assets/fireworks1.mp4";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Login"; // import the Login component

function Home() {
  const auth = useSelector((state) => state.authinfo);
  const [showLogin, setShowLogin] = useState(false);

  // Show login popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={bg} type="video/mp4" />
      </video>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg mb-6">
          Welcome to My Page
        </h1>

        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-white/80 text-black font-semibold hover:bg-blue-500 transition">
            <Link to="/product">Purchase</Link>
          </button>

          {auth?.user?.role === "admin" && (
            <div className="mt-4 text-center">
              <Link
                to="/Add_product"
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
              >
                Add Stock
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Popup Login */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Login />
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-5 right-5 text-white text-2xl font-bold"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
