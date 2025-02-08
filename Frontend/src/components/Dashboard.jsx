import React, { useState } from "react";
import WalletGenerator from "./WalletGenerator";
import ImportWallet from "./ImportWallet";
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

const Dashboard = () => {
  const [publicKeyInput, setPublicKeyInput] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState("mainnet");

  const checkBalance = async () => {
    if (!publicKeyInput) {
      setError("Please enter a public key.");
      return;
    }
  
    setIsLoading(true);
    setError("");
    setBalance(null);
  
    try {
      console.log("Selected Network:", network);
  
      const connection = new Connection(
        clusterApiUrl(network === "mainnet" ? "mainnet-beta" : "devnet"),
        "confirmed"
      );
  
      console.log("Connection established. Checking balance for:", publicKeyInput);
  
      const publicKey = new PublicKey(publicKeyInput);
      console.log("Converted Public Key:", publicKey.toString());
  
      const balanceInLamports = await connection.getBalance(publicKey);
      console.log("Balance in Lamports:", balanceInLamports);
  
      const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
      console.log("Balance in SOL:", balanceInSOL);
  
      setBalance(balanceInSOL);
    } catch (error) {
      console.error("Error checking balance:", error);
  
      if (error.message.includes("Invalid public key")) {
        setError("Invalid public key format. Please check and try again.");
      } else {
        setError("Error fetching balance. Please try again.");
      }
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

        {/* Right Side: Import Wallet */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Import Existing Wallet</h2>
            <ImportWallet />
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Wallet Balance
              </label>
              
              {/* Network Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="mainnet">Mainnet</option>
                  <option value="devnet">Devnet</option>
                </select>
              </div>

              <input
                type="text"
                value={publicKeyInput}
                onChange={(e) => setPublicKeyInput(e.target.value)}
                placeholder="Enter public key"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
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
                    Network: {network}
                  </p>
                </div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;