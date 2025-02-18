import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import TransactionHistory from './components/TransactionHistory';

function App() {
  const currentPath = window.location.pathname;
  const showNavbar = !["/", "/signup"].includes(currentPath);

  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {showNavbar && <Navbar />}
        <div className="flex-grow flex items-start pt-10">
          <div className="w-full max-w-8x mx-auto px-6">
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/transactions" element={<TransactionHistory />} />
            </Routes>
          </div>
        </div>
      </div>
    </UserProvider>
  );
}

export default App;