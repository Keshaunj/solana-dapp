// src/components/ImportWallet.jsx
import React from "react";

const ImportWallet = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Import your existing Solana wallet
      </p>
      <div className="space-y-2">
        <button className="w-full p-3 border rounded-lg hover:bg-gray-50">
          Connect Phantom Wallet
        </button>
        <button className="w-full p-3 border rounded-lg hover:bg-gray-50">
          Connect Solflare Wallet
        </button>
      </div>
    </div>
  );
};

export default ImportWallet;