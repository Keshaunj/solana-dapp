import React, { useState } from 'react';
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const ImportWallet = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState('devnet'); // Default to Devnet

  // Alchemy RPC URLs
  const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
  const ALCHEMY_RPC_URLS = {
     mainnet: `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  };

  const handleImportWallet = () => {
    try {
      // Validate private key input
      if (!privateKey || privateKey.length !== 128) {
        setError('Invalid private key. It must be a 128-character hex string.');
        return;
      }
  
      // Convert private key hex string to Uint8Array
      const privateKeyBytes = new Uint8Array(
        privateKey.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );
  
      // Generate Keypair from private key
      const keypair = Keypair.fromSecretKey(privateKeyBytes);
  
      // Set wallet address
      setWalletAddress(keypair.publicKey.toString());
      setError('');
      setBalance(null); // Reset balance when importing a new wallet
    } catch (err) {
      setError('Failed to import wallet. Please check the private key and try again.');
      console.error(err);
    }
  };
  

  const checkBalance = async () => {
    if (!walletAddress) {
      setError('No wallet address found. Please import a wallet first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create a connection to the selected network using Alchemy's RPC URL
      const connection = new Connection(
        ALCHEMY_RPC_URLS[network],
        'confirmed'
      );

      // Convert wallet address to PublicKey
      const publicKey = new PublicKey(walletAddress);

      // Fetch balance
      const balanceInLamports = await connection.getBalance(publicKey);
      const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

      // Set balance
      setBalance(balanceInSOL);
    } catch (err) {
      setError('Failed to fetch balance. Please try again.');
      console.error(err);
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
            Enter Private Key (64-character hex string):
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

          {/* Network Selection */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-700">
              Network
            </label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="devnet">Devnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </div>

          {/* Check Balance Button */}
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

          {/* Display Balance */}
          {balance !== null && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
              <p>Balance: {balance.toFixed(4)} SOL</p>
              <p className="text-sm">Network: {network}</p>
            </div>
          )}

          {/* Clear Wallet Button */}
          <button
            onClick={() => {
              setWalletAddress(null);
              setBalance(null);
              setPrivateKey('');
            }}
            className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportWallet;