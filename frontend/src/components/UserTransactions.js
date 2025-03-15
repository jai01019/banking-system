import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserTransactions = () => {
  const { userId } = useParams(); // Extract user ID from URL
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/transactions`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();

          // Ensure the response contains valid data
          if (data.balance && Array.isArray(data.transactions)) {
            // Filter transactions by user_id
            const filteredTransactions = data.transactions.filter(
              (transaction) => transaction.user_id == userId
            );

            // Calculate total balance for the specific user
            const totalBalance = filteredTransactions.reduce(
              (sum, t) => sum + parseFloat(t.amount),
              0
            );

            setBalance(totalBalance.toFixed(2));
            setTransactions(filteredTransactions);
          } else {
            setError('Invalid data format received from the server');
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch transactions');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('An error occurred while fetching transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, navigate]);

  const handleBack = () => {
    navigate('/banker-accounts');
  };

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2>User Transactions</h2>
      <button onClick={handleBack} style={styles.backButton}>Back to Accounts</button>

      <div style={styles.balanceContainer}>
        <h3>Total Balance: ₹{balance}</h3>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.type}</td>
                <td>₹{transaction.amount}</td>
                <td>{new Date(transaction.created_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  balanceContainer: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
};

export default UserTransactions;