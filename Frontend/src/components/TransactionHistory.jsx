import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      const validTransactions = data.filter(tx => tx.senderAddress && tx.recipientAddress);
      setTransactions(validTransactions);
    } catch (error) {
    
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction record?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/auth/transaction/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

   
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-purple-600">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/dashboard"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold text-purple-600">Transaction History</h2>
        <div className="w-36"></div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Amount (SOL)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Signature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(tx.timestamp || tx.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {tx.senderAddress.slice(0, 6)}...{tx.senderAddress.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {tx.recipientAddress.slice(0, 6)}...{tx.recipientAddress.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.amount} SOL
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {tx.signature ? `${tx.signature.slice(0, 6)}...${tx.signature.slice(-4)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 