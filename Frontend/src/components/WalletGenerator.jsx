// src/components/WalletGenerator.jsx
import React, { useState } from "react";
import { Keypair } from "@solana/web3.js";

const WalletGenerator = () => {
  const [wallet, setWallet] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const generateNewWallet = () => {
    try {
      console.log("Starting wallet generation...");
      
      const newWallet = Keypair.generate();
      console.log("Keypair generated");

      // Convert secretKey to hex string
      const privateKeyHex = Array.from(newWallet.secretKey)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

      setWallet({
        publicKey: newWallet.publicKey.toString(),
        privateKey: privateKeyHex
      });
      
    } catch (error) {
      console.error("Detailed error:", error);
      alert("Error generating wallet");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <button 
        onClick={generateNewWallet}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 mb-4"
      >
        Generate New Wallet
      </button>

      {wallet && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Public Key:</h3>
            <p className="bg-gray-50 p-2 rounded break-all text-sm">{wallet.publicKey}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Private Key:</h3>
            <div className="relative bg-gray-50 p-2 rounded">
              <p className="break-all text-sm">
                {showPrivateKey ? wallet.privateKey : '•'.repeat(64)}
              </p>
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="absolute top-2 right-2 text-purple-600 hover:text-purple-700"
              >
                {showPrivateKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletGenerator;