import { useState, useEffect } from 'react';
import bs58 from 'bs58';

const TransactionPanel = ({ walletAddress, privateKey }) => {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');


  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  
  const cleanAddress = (address) => {
    return address.replace(/\s+/g, ''); 
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError('You must be logged in to send SOL.');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setSuccess('');
    setTransactionStatus('Initiating transaction...');
  
    try {
      if (!recipientAddress || !amount) {
        throw new Error('Recipient address and amount are required');
      }

      if (parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (!privateKey) {
        throw new Error('Wallet not properly imported. Please import your wallet first.');
      }

     
      const cleanRecipientAddress = cleanAddress(recipientAddress);
      const cleanSenderAddress = cleanAddress(walletAddress);

      try {
        bs58.decode(cleanRecipientAddress);
        bs58.decode(cleanSenderAddress);
      } catch (error) {
        throw new Error('Invalid wallet address format');
      }

      
      const privateKeyBytes = new Uint8Array(
        privateKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      );

  

      setTransactionStatus('Sending transaction...');
      const response = await fetch('http://localhost:3000/auth/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderAddress: cleanSenderAddress,
          senderPrivateKey: privateKey,
          recipientAddress: cleanRecipientAddress,
          amount: parseFloat(amount)
        }),
      });

      const responseText = await response.text();
   

      let data;
      try {
        data = JSON.parse(responseText);
       
      } catch (err) {
       
        throw new Error('Invalid server response');
      }
  
      if (!response.ok) {
        if (data.details?.includes('expired') || data.details?.includes('block height exceeded')) {
          setSuccess(`Transaction likely completed, but confirmation timed out. Amount: ${amount} SOL`);
          setTransactionStatus('Transaction sent but confirmation timed out');
        } else {
          throw new Error(data.details || data.error || 'Transaction failed');
        }
      } else {
        setSuccess(`Successfully sent ${amount} SOL to ${cleanRecipientAddress}`);
        setTransactionStatus('Transaction completed');
      }

      setAmount('');
      setRecipientAddress('');
    } catch (err) {
      console.error('Transaction error details:', err);
      setError(err.message || 'Failed to send transaction');
      setTransactionStatus('Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleRecipientAddressChange = (e) => {
    const cleaned = cleanAddress(e.target.value);
    setRecipientAddress(cleaned);
  };

  return (
    <div className="mt-1 p-4 bg-white rounded-lg border border-gray-200 max-w-md mx-auto">
      <h3 className="text-lg font-medium mb-3">Send SOL</h3>

     
      {isLoggedIn ? (
        <form onSubmit={handleSend} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={handleRecipientAddressChange}
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
      ) : (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded mb-4">
          <p className="text-sm text-yellow-600">Please log in to send SOL</p>
        </div>
      )}

      {transactionStatus && (
        <div className={`mt-2 text-sm ${
          transactionStatus.includes('failed') ? 'text-red-500' :
          transactionStatus.includes('completed') ? 'text-green-500' :
          'text-blue-500'
        }`}>
          {transactionStatus}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {recipientAddress && (
        <div className="mt-1">
          <h3 className="text-lg font-medium mb-3">Recipient Address</h3>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Recipient's wallet address:</p>
            <p className="break-all font-mono text-sm">{recipientAddress}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPanel;
