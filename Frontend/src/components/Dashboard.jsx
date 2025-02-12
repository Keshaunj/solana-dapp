import React, { useState } from "react";
import WalletGenerator from "./WalletGenerator";
import ImportWallet from "./ImportWallet";
import { checkBalanceAPI } from '../utils/api';

const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkBalance = async () => {
    if (!walletAddress) {
      setError("Please import a wallet first.");
      return;
    }

    setIsLoading(true);
    setError("");
    setBalance(null);

    try {
      const data = await checkBalanceAPI(walletAddress);
      setBalance(data.balance);
    } catch (error) {
      console.error("Error checking balance:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-8">
        {/* Left Side: Create Wallet */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create Solana Wallet</h2>
            <WalletGenerator />
          </div>
        </div>

        {/* Right Side: Import Wallet and Transactions */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Import Existing Wallet</h2>
            <ImportWallet setWalletAddress={setWalletAddress} />
            
            {walletAddress && (
              <>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Wallet Balance</h3>
                  
                  <button
                    onClick={checkBalance}
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded ${
                      isLoading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white mb-4`}
                  >
                    {isLoading ? 'Checking Balance...' : 'Check Balance'}
                  </button>

                  {balance !== null && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                      <h3 className="text-green-800 font-medium">
                        Balance: {balance.toFixed(4)} SOL
                      </h3>
                      <p className="text-sm text-green-600 mt-1">
                        Network: Mainnet
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}
                </div>
               
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;