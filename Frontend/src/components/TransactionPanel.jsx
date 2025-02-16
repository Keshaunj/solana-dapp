import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const TransactionPanel = () => {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState("8A6gtqMvghJBvuQXpXmK16oaLr4C6nag4YeHtHrX332a");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [solanaWeb3, setSolanaWeb3] = useState(null);
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Solana Web3
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js';
    script.async = true;
    script.onload = () => {
      console.log('Solana Web3 loaded successfully');
      setSolanaWeb3(window.solanaWeb3);
    };
    document.head.appendChild(script);
    
    // Login on component mount
    login();
  }, []);

  const login = async () => {
    try {
      const loginResponse = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: "KJdev2",
          password: "qwerty"
        })
      });
      
      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }

      const data = await loginResponse.json();
      setToken(data.token);
      console.log('Successfully logged in and got token');
      
      // Fetch transaction history after successful login
      fetchTransactionHistory(data.token);
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
    }
  };

  const fetchTransactionHistory = async (authToken) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/transactions/9yXwxVBQHHFxfrm2Y5wG2frWRc7UVGz8z6ZUEPKgzsM6`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      // Create the keypair
      const privateKeyHex = "064297b0ba6246ff746583b9fcacd7fd7a1d14088a80b4db2bafa313158b0fee";
      const privateKeyBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
          privateKeyBytes[i] = parseInt(privateKeyHex.substr(i * 2, 2), 16);
      }
      
      const keypair = solanaWeb3.Keypair.fromSeed(privateKeyBytes);
      console.log('Using public key:', keypair.publicKey.toBase58());

      // Get stored token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Send transaction request
      const response = await fetch('http://localhost:3000/auth/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senderAddress: keypair.publicKey.toBase58(),
          senderPrivateKey: Array.from(keypair.secretKey),
          recipientAddress: recipientAddress,
          amount: parseFloat(amount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Transaction failed');
      }

      console.log('Transaction successful:', data);
      setSuccess(true);
      setAmount('');

    } catch (error) {
      console.error('Transaction error:', error);
      setError(error.message || 'Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async () => {
    try {
      setError(null);
      
      // Create the private key bytes
      const privateKeyHex = "064297b0ba6246ff746583b9fcacd7fd7a1d14088a80b4db2bafa313158b0fee";
      const privateKeyBytes = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
          privateKeyBytes[i] = parseInt(privateKeyHex.substr(i * 2, 2), 16);
      }
      
      // Create keypair
      const keypair = window.solanaWeb3.Keypair.fromSeed(privateKeyBytes);
      
      // Use GenesysGo's public RPC endpoint
      const connection = new window.solanaWeb3.Connection(
        'https://ssc-dao.genesysgo.net/',
        {
          commitment: 'confirmed',
          wsEndpoint: undefined
        }
      );

      // Get balance
      const balance = await connection.getBalance(keypair.publicKey);
      const solBalance = balance / window.solanaWeb3.LAMPORTS_PER_SOL;
      setBalance(solBalance);
      console.log('Balance updated:', solBalance);

    } catch (error) {
      console.error('Balance check error:', error);
      // Don't show error to user, just log it
      console.log('Failed to get balance, will retry later');
    }
  };

  // Check balance less frequently to avoid rate limits
  useEffect(() => {
    if (window.solanaWeb3) {
      const timer = setTimeout(checkBalance, 1000); // Initial delay
      return () => clearTimeout(timer);
    }
  }, [window.solanaWeb3]);

  // Periodic balance check
  useEffect(() => {
    if (window.solanaWeb3) {
      const interval = setInterval(checkBalance, 300000); // Every 5 minutes
      return () => clearInterval(interval);
    }
  }, [window.solanaWeb3]);

  return (
    <div className="transaction-panel">
     
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          Transaction sent successfully!
        </div>
      )}

      <form onSubmit={handleSend}>
        <div className="form-group">
          <label htmlFor="amount">Amount (SOL)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0.0001"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !amount}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Sending...' : 'Send SOL'}
        </button>
      </form>

      <div className="recipient-info">
        <p>Recipient Address:</p>
        <code>{recipientAddress}</code>
      </div>

      <div>
        <h3>Transaction History</h3>
        <table style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.type}</td>
                <td>{tx.amount} SOL</td>
                <td style={{ 
                  color: tx.status === 'completed' ? 'green' : 
                         tx.status === 'failed' ? 'red' : 'orange'
                }}>
                  {tx.status}
                </td>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td>
                  <a 
                    href={`https://explorer.solana.com/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.signature.slice(0, 8)}...
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="balance-section">
        <button onClick={checkBalance} className="balance-button">
          Check Balance
        </button>
        {balance !== null && (
          <div className="balance-display">
            Balance: {balance.toFixed(4)} SOL
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPanel;
