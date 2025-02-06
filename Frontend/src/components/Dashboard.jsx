
import React from "react"
import WalletGenerator from "./WalletGenerator"
import ImportWallet from "./ImportWallet"

const Dashboard = () => {
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard