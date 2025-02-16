import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  publicKey: { type: String, required: true },
  balance: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactions: [{
    type: { 
      type: String, 
      enum: ['buy', 'sell', 'deposit', 'withdraw'], 
      required: true 
    },
    amount: { type: Number, required: true },
    signature: { type: String, required: true },
    recipientAddress: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'], 
      default: 'pending' 
    },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// For faster queries
walletSchema.index({ publicKey: 1, user: 1 });
walletSchema.index({ 'transactions.signature': 1 });
walletSchema.index({ 'transactions.date': -1 });

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;