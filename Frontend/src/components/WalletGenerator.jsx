// src/components/WalletGenerator.jsx
import React, { useState } from "react";
import { Keypair, Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } from "@solana/web3.js";

const WalletGenerator = () => {
 const [wallet, setWallet] = useState(null);
 const [showPrivateKey, setShowPrivateKey] = useState(false);
 const [balance, setBalance] = useState(null);
 const [isAirdropLoading, setIsAirdropLoading] = useState(false);

 const generateNewWallet = () => {
   try {
     console.log("Starting wallet generation...");
     const newWallet = Keypair.generate();
     
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

 const checkBalance = async () => {
  if (!wallet) return;
  
  try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      // Convert string public key to PublicKey object
      const publicKey = new PublicKey(wallet.publicKey);
      console.log("Checking balance for wallet:", publicKey.toString());

      const balanceInLamports = await connection.getBalance(publicKey);
      const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
      
      setBalance(balanceInSOL);
      console.log("Balance:", balanceInSOL, "SOL");
  } catch (error) {
      console.error("Balance check error:", error);
      alert("Error checking balance. Please try again.");
  }
};

 const requestAirdrop = async () => {
   if (!wallet) return;
   
   try {
     setIsAirdropLoading(true);
     const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
     const publicKey = new PublicKey(wallet.publicKey);
     
     console.log("Requesting airdrop for:", publicKey.toString());
     
     const airdropSignature = await connection.requestAirdrop(
       publicKey,
       LAMPORTS_PER_SOL
     );
     
     console.log("Airdrop requested, signature:", airdropSignature);

     const latestBlockHash = await connection.getLatestBlockhash();
     
     await connection.confirmTransaction({
       blockhash: latestBlockHash.blockhash,
       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
       signature: airdropSignature,
     });

     console.log("Airdrop confirmed");
     
     await checkBalance();
     alert("1 SOL airdropped successfully!");
   } catch (error) {
     console.error("Detailed airdrop error:", error);
     
     if (error.message.includes("429")) {
       const faucetUrl = "https://faucet.solana.com";
       const message = `Airdrop limit reached. Please visit the Solana Faucet to get test SOL:\n\n${faucetUrl}`;
       alert(message);
       window.open(faucetUrl, '_blank');
     } else {
       alert("Failed to request airdrop. Please try again later.");
     }
   } finally {
     setIsAirdropLoading(false);
   }
 };

 return (
   <div className="p-4 bg-white rounded-lg shadow">
     <div>
       <p className="text-gray-600 mb-4">
         Create your Solana wallet on Devnet for testing
       </p>
       <button 
         onClick={generateNewWallet}
         className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 mb-4"
       >
         Generate New Wallet
       </button>
     </div>

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

         <div className="space-y-1">
           <button
             onClick={checkBalance}
             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
           >
             Check Balance
           </button>
           
           <button
             onClick={requestAirdrop}
             disabled={isAirdropLoading}
             className={`w-full py-2 px-4 rounded ${
               isAirdropLoading 
                 ? 'bg-gray-400 cursor-not-allowed' 
                 : 'bg-green-600 hover:bg-green-700'
             } text-white`}
           >
             {isAirdropLoading ? 'Requesting...' : 'Request 1 SOL (Devnet)'}
           </button>

           {balance !== null && (
             <p className="text-center text-gray-600">
               Balance: {balance} SOL (Devnet)
             </p>
           )}

           <div className="text-xs text-gray-500 text-center mt-2">
             Note: If airdrop fails, visit{' '}
             <a 
               href="https://faucet.solana.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-purple-600 hover:text-purple-700 underline"
             >
               Solana Faucet
             </a>
             {' '}for test SOL
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default WalletGenerator;