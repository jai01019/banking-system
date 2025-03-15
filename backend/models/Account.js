//models/Account.js

const db = require('../config/db');

class Account {
  static async getBalance(userId) {
    const [transactions] = await db.query(`
      SELECT type, SUM(amount) as total 
      FROM Accounts 
      WHERE user_id = ?
      GROUP BY type
    `, [userId]);
    
    return transactions.reduce((acc, curr) => {
      return curr.type === 'deposit' ? acc + curr.total : acc - curr.total;
    }, 0);
  }

  static async createTransaction(userId, amount, type) {
    const [result] = await db.query(
      'INSERT INTO Accounts (user_id, amount, type) VALUES (?, ?, ?)',
      [userId, amount, type]
    );
    return result.insertId;
  }

  static async getTransactions(userId) {
    const [transactions] = await db.query(
      'SELECT * FROM Accounts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return transactions;
  }
}

module.exports = Account;