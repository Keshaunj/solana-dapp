import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignIn from './components/Signin';
import Signup from './components/Signup';
import ImportWallet from './components/ImportWallet';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication token on mount
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const DashboardLayout = () => (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Solana Wallet Dashboard</h1>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main>
        <Dashboard />
      </main>
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Flash Firm Solana Wallet Manager • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={
          !isAuthenticated ? (
            <SignIn onSignInSuccess={() => setIsAuthenticated(true)} />
          ) : (
            <Navigate to="/dashboard" />
          )
        } />
        
        <Route path="/signup" element={
          !isAuthenticated ? (
            <Signup onSignupSuccess={() => setIsAuthenticated(true)} />
          ) : (
            <Navigate to="/dashboard" />
          )
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;