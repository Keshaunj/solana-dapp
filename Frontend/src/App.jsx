import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignIn from './components/Signin';
import Signup from './components/Signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Null to handle loading state
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (isAuthenticated === null) {
      return <div className="text-center mt-10">Loading...</div>; // Show loading while checking auth
    }
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  const DashboardLayout = () => (
    <div className="min-h-screen bg-gray-50 p-7">
      <header className="mb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Solana Wallet Dashboard</h1>
          <button 
            onClick={handleSignOut}
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

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={
          isAuthenticated === false ? (
            <SignIn onSignInSuccess={() => setIsAuthenticated(true)} />
          ) : isAuthenticated === null ? (
            <div className="text-center mt-10">Loading...</div>
          ) : (
            <Navigate to="/dashboard" />
          )
        } />

        <Route path="/signup" element={
          isAuthenticated === false ? (
            <Signup onSignupSuccess={() => setIsAuthenticated(true)} />
          ) : isAuthenticated === null ? (
            <div className="text-center mt-10">Loading...</div>
          ) : (
            <Navigate to="/dashboard" />
          )
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
