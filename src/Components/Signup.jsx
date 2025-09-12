import React, { useState } from "react";
import { motion } from "framer-motion";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      console.log("🎆 Signup Data:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    }
  };

  const sparks = Array.from({ length: 25 });

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-500 via-red-600 to-pink-700 overflow-hidden">
      {/* Spark Particles 🎇 */}
      <div className="absolute inset-0 pointer-events-none">
        {sparks.map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-lg"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              y: [null, Math.random() * -60],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Signup Card */}
      <motion.div
        className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-yellow-400"
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-red-600 via-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎇 Create Account 🎆
        </motion.h2>
        <p className="text-center text-gray-600 text-sm">
          Join us and light up your celebrations ✨
        </p>

        {submitted && (
          <motion.div
            className="p-3 text-center bg-green-100 text-green-700 rounded-lg font-medium"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✅ Signup successful! Welcome to the fireworks family 🎉
          </motion.div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none transition ${
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <motion.p
                className="text-red-600 text-sm mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none transition ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <motion.p
                className="text-red-600 text-sm mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none transition ${
                errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
              }`}
              placeholder="********"
            />
            {errors.password && (
              <motion.p
                className="text-red-600 text-sm mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none transition ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-yellow-500"
              }`}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <motion.p
                className="text-red-600 text-sm mt-1"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </div>

          {/* Sign Up Button */}
          <motion.button
            type="submit"
            className="w-full py-3 mt-4 font-bold text-lg text-white bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 rounded-xl shadow-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255,200,50,0.9)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            🎆 Sign Up
          </motion.button>

          {/* Redirect */}
          <p className="text-sm text-center text-gray-700">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-red-600 font-semibold hover:underline hover:text-yellow-600 transition"
            >
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
