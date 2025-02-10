import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },  // Store the user's balance here
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
  transactions: [
    {
      type: { type: String, enum: ['deposit'], required: true }, // Only deposit not withdrawls dont have captial for that
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;
