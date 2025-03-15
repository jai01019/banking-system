import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
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
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
          navigate('/');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleTransaction = async (type, amount) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, type }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Transaction successful: ${type} of $${amount}`);
        setError('');
        // Update user data after successful transaction
        const updatedResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/api/transactions`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedData = await updatedResponse.json();
        setUserData(updatedData);
      } else {
        // Check for insufficient funds error
        if (data.error && data.error === 'Insufficient funds') {
          setError('Transaction failed: Insufficient funds.');
        } else {
          setError(`Transaction failed: ${data.error || 'Unknown error'}`);
        }
        setMessage('');
      }
    } catch (err) {
      console.error('Error during transaction:', err);
      setError('An unexpected error occurred.');
      setMessage('');
    }
  };

  const handleDeposit = () => {
    const amount = prompt('Enter deposit amount:');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      handleTransaction('deposit', parseFloat(amount));
    } else {
      setError('Please enter a valid positive number.');
      setMessage('');
    }
  };

  const handleWithdraw = () => {
    const amount = prompt('Enter withdrawal amount:');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      handleTransaction('withdrawal', parseFloat(amount));
    } else {
      setError('Please enter a valid positive number.');
      setMessage('');
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Customer Dashboard</h2>
      <p><strong>Balance:</strong> ${userData.balance}</p>
      <h3>Transaction History</h3>
      <ul>
        {userData.transactions.map((tx) => (
          <li key={tx.id}>
            {tx.type}: ${tx.amount} on {new Date(tx.created_at).toLocaleString()}
          </li>
        ))}
      </ul>

      <div style={styles.buttonsContainer}>
        <button onClick={handleDeposit} style={styles.actionButton}>Deposit</button>
        <button onClick={handleWithdraw} style={styles.actionButton}>Withdraw</button>
      </div>

      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}

      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  actionButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  successMessage: {
    color: 'green',
    marginTop: '10px',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
};

export default CustomerDashboard;