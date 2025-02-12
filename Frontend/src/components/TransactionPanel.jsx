import React, { useState } from 'react';

const TransactionPanel = ({ walletAddress }) => {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/auth/send-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderAddress: walletAddress,
          recipientAddress,
          amount: parseFloat(amount)
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send transaction');
      }

      setSuccess(`Successfully sent ${amount} SOL to ${recipientAddress}`);
      setAmount('');
      setRecipientAddress('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Send SOL</h3>
      
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter recipient's wallet address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (SOL)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.000000001"
            min="0"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter amount to send"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded ${
            isLoading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {isLoading ? 'Sending...' : 'Send SOL'}
        </button>
      </form>

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Receive SOL</h3>
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Your wallet address:</p>
          <p className="break-all font-mono text-sm">{walletAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionPanel;