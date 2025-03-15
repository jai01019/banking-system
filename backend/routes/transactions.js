//routes/transaction.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

router.get('/', auth(['customer', 'banker']), async (req, res) => {
    try {
        let transactions = [];
        let balance = 0;

        if (req.user.role === 'customer') {
            // Fetch transactions for the specific customer
            [transactions] = await db.query(`
                SELECT id, type, amount, created_at 
                FROM Accounts 
                WHERE user_id = ?
            `, [req.user.id]);

            // Calculate the remaining balance for the customer
            balance = transactions.reduce((acc, curr) => {
                const amount = parseFloat(curr.amount); // Convert amount to a number
                return curr.type === 'deposit' ? acc + amount : acc - amount;
            }, 0);

        } else if (req.user.role === 'banker') {
            // Fetch all transactions with full details for the banker
            [transactions] = await db.query(`
                SELECT a.id, a.user_id, a.type, a.amount, a.created_at, u.name, u.email 
                FROM Accounts a
                JOIN Users u ON a.user_id = u.id
            `);

            // Calculate the total balance across all accounts for the banker
            balance = transactions.reduce((acc, curr) => {
                const amount = parseFloat(curr.amount); // Convert amount to a number
                return curr.type === 'deposit' ? acc + amount : acc - amount;
            }, 0);
        }

        // Send the response with balance and transactions
        res.json({ 
            balance: req.user.role === 'customer' ? balance.toFixed(2) : { totalBalance: balance.toFixed(2) }, 
            transactions 
        });

    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error' });
    }
});


// Create transaction
router.post('/', auth(['customer']), async (req, res) => {
    const { amount, type } = req.body;

    if (!amount || !type || (type !== 'deposit' && type !== 'withdrawal')) {
        return res.status(400).send({ error: 'Invalid input' });
    }

    try {
        if (type === 'withdrawal') {
            const [[{ balance }]] = await db.query(`
                SELECT 
                    SUM(CASE WHEN type='deposit' THEN amount ELSE -amount END) as balance 
                FROM Accounts 
                WHERE user_id = ?
            `, [req.user.id]);

            if (balance < amount) {
                return res.status(400).send({ error: 'Insufficient funds' });
            }
        }

        await db.query(
            'INSERT INTO Accounts (user_id, amount, type, created_at) VALUES (?, ?, ?, NOW())',
            [req.user.id, amount, type]
        );

        res.status(201).send({ message: 'Transaction successful' });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;