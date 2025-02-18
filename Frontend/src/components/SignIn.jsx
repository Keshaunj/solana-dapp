import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from '../context/UserContext';

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useUser();


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        updateUser(data.user);
        
       
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Error connecting to server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 
            className="mt-6 text-center text-4xl"
            style={{ 
              fontFamily: '"Bungee Spice", serif',
              fontWeight: 400,
              fontStyle: 'normal'
            }}
          >
            Flash Firm Decentralized Finance (DeFi)
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Non-Custodial Blockchain Solution
          </p>
        </div>
        
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
          <Link
            to="/signup"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
