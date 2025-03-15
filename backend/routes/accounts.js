// //routes/accounts.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const db = require('../config/db');
// const Account = require('../models/Account');

// // Get all customers (banker only)
// router.get('/', auth(['banker']), async (req, res) => {
//   try {
//     const [users] = await db.query(
//       'SELECT id, name, email, created_at FROM Users WHERE role = "customer"'
//     );
//     res.json(users);
//   } catch (error) {
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// // Get customer transactions (banker only)
// router.get('/:userId/transactions', auth(['banker']), async (req, res) => {
//   try {
//     const transactions = await Account.getTransactions(req.params.userId);
//     res.json(transactions);
//   } catch (error) {
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get all customers (banker only)
router.get('/', auth(['banker']), async (req, res) => {
  try {
    // Fetch all customer accounts from the database
    const [users] = await db.query(
      'SELECT id, name, email, created_at FROM Users WHERE role = "customer"'
    );

    // Wrap the response in an object with an 'accounts' key
    res.json({ accounts: users });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send({ error: 'Server error' });
  }
});

// Get customer transactions (banker only)
router.get('/:userId/transactions', auth(['banker']), async (req, res) => {
  try {
    const transactions = await Account.getTransactions(req.params.userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;