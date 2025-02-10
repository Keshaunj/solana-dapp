import React, { useState } from 'react';

const Signup = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful! Please sign in.');
        onSignupSuccess?.();
      } else {
        setError(data.message || 'Error during signup');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-bold mb-8">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

      

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSignupSuccess}
              className="text-purple-600 hover:text-purple-700"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By signing up, you agree to our</p>
          <p>
            <a href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;