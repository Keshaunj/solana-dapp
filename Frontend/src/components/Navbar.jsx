import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { currentUser, logout } = useUser();
  const [solanaPrice, setSolanaPrice] = useState('0.00');
  const [priceChange, setPriceChange] = useState('0.00');

  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        if (data && data.solana) {
          setSolanaPrice(data.solana.usd.toString());
          setPriceChange(data.solana.usd_24h_change.toString());
        }
      } catch (error) {
        setSolanaPrice('0.00');
        setPriceChange('0.00');
      }
    };

    fetchSolanaPrice();
    const interval = setInterval(fetchSolanaPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = (e) => {
    e.preventDefault();
    if (logout) {
      logout();
    }
    window.location.href = '/';
  };

  return (
    <nav className="bg-purple-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/dashboard" className="text-white hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/transactions" className="text-white hover:text-gray-200">
            Transaction History
          </Link>
          <Link to="/profile" className="text-white hover:text-gray-200">
            Profile
          </Link>
        </div>

        <div className="flex items-center space-x-2 text-white">
          <a 
            href="https://coinmarketcap.com/currencies/solana/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-gray-200 transition-colors"
          >
            <span className="font-bold">SOL:</span>
            <span className="font-mono">${Number(solanaPrice).toFixed(2)}</span>
            <span className={`font-mono ${Number(priceChange) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              ({Number(priceChange).toFixed(2)}%)
            </span>
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <span className="text-white font-medium">
            {currentUser?.username || ''}
          </span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;