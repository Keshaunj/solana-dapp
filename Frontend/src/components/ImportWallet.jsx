import React, { useState } from 'react';
import { Keypair } from '@solana/web3.js';

const ImportWallet = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Remove network state since we're only using mainnet
  
  const handleImportWallet = () => {
    try {
      if (!privateKey || privateKey.length !== 128) {
        setError('Invalid private key. It must be a 128-character hex string.');
        return;
      }

      const privateKeyBytes = new Uint8Array(
        privateKey.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );

      const keypair = Keypair.fromSecretKey(privateKeyBytes);
      setWalletAddress(keypair.publicKey.toString());
      setError('');
      setBalance(null);
    } catch (err) {
      setError('Failed to import wallet. Please check the private key and try again.');
      console.error(err);
    }
  };

  const checkBalance = async () => {
    if (!walletAddress) {
      setError("Please import a wallet first.");
      return;
    }
  
    setIsLoading(true);
    setError(""); 
    setBalance(null); 
  
    try {
      const response = await fetch('/auth/check-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error fetching balance. Please try again.");
      } else {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Error checking balance:", error);
      setError("Error fetching balance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!walletAddress ? (
        <div className="flex flex-col gap-4">
          <label className="block text-gray-700">
            Enter Private Key (128-character hex string):
          </label>
          <input
            type="text"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="e.g., 4a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleImportWallet}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Import Wallet
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-gray-700">
            Wallet Address: {walletAddress}
          </p>

          <button
            onClick={checkBalance}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? 'Checking Balance...' : 'Check Balance'}
          </button>

          {balance !== null && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
              <p>Balance: {balance.toFixed(4)} SOL</p>
              <p className="text-sm">Network: Mainnet</p>
            </div>
          )}

          <button
            onClick={() => {
              setWalletAddress(null);
              setBalance(null);
              setPrivateKey('');
            }}
            className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Delete Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportWallet;