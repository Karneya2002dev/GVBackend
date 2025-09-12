import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/User"; // import action
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ use correct slice name
  const auth = useSelector((state) => state.authinfo);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
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
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ determine role
    let role = "user"; // default role
    if (
      formData.email === "gvcrackers2@gmail.com" &&
      formData.password === "gvcrackers"
    ) {
      role = "admin";
    }

    dispatch(
      setUser({
        email: formData.email,
        password: formData.password,
        role,
      })
    );

    setSubmitted(true);
    setFormData({ email: "", password: "" });

    // ✅ navigate after login
    navigate("/");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen  overflow-hidden">
      <motion.div
        className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-yellow-200"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center">🔥 Login</h2>

        {submitted && auth?.isAuthenticated && (
          <motion.div
            className="p-3 text-center bg-green-100 text-green-700 rounded-lg font-medium"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✅ Welcome, {auth?.user?.email} 🎉
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg"
            />
            {errors.email && <p className="text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg"
            />
            {errors.password && <p className="text-red-600">{errors.password}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 font-bold text-lg text-white bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl shadow-lg"
          >
            Login
          </button>
        </form>

      
      </motion.div>
    </div>
  );
}

export default Login;
