import { useState } from "react";
import { Keypair, Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } from "@solana/web3.js";

const WalletGenerator = () => {
 const [wallet, setWallet] = useState(null);
 const [showPrivateKey, setShowPrivateKey] = useState(false);
 const [balance, setBalance] = useState(null);


 const generateNewWallet = () => {
   try {
    
     const newWallet = Keypair.generate();
     
    
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
     
      const publicKey = new PublicKey(wallet.publicKey);
     

      const balanceInLamports = await connection.getBalance(publicKey);
      const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
      
      setBalance(balanceInSOL);
    
  } catch (error) {
     
      alert("Error checking balance. Please try again.");
  }
};

 const requestAirdrop = async () => {
   if (!wallet) return;
   
   try {
     setIsAirdropLoading(true);
     const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
     const publicKey = new PublicKey(wallet.publicKey);
     
   
     
     const airdropSignature = await connection.requestAirdrop(
       publicKey,
       LAMPORTS_PER_SOL
     );
     
    

     const latestBlockHash = await connection.getLatestBlockhash();
     
     await connection.confirmTransaction({
       blockhash: latestBlockHash.blockhash,
       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
       signature: airdropSignature,
     });

    
     
     await checkBalance();
     alert("1 SOL airdropped successfully!");
   } catch (error) {
   
     
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
       Create your Solana wallet in seconds and start exploring the power of Web3 securely on our platform!
       Always store your private keys securely—if you lose them, you lose access to your wallet forever!
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
      
           
         

           {balance !== null && (
             <p className="text-center text-gray-600">
               Balance: {balance} SOL (Devnet)
             </p>
           )}

          
         </div>
       </div>
     )}
   </div>
 );
};

export default WalletGenerator;