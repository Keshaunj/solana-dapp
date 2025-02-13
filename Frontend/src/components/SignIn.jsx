import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ onSignInSuccess }) => {
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Sending username instead of email
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (onSignInSuccess) {
          onSignInSuccess();
        }
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Error connecting to server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Sign In</h2>
        
        {error && <p className="text-red-500 text-lg text-center mb-6">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg text-gray-700 font-semibold">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-5 py-3 text-lg border rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-lg text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 text-lg border rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 text-lg rounded-xl hover:bg-purple-700 transition"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-lg text-gray-600 mt-6 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
