const mongoose = require('mongoose');

const adminWalletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: [{
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        },
        amount: Number,
        type: {
            type: String,
            enum: ['credit', 'debit']
        },
        description: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdminWallet', adminWalletSchema);
