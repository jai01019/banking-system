import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLogin from './components/CustomerLogin';
import BankerLogin from './components/BankerLogin';
import CustomerDashboard from './components/CustomerDashboard';
import BankerAccounts from './components/BankerAccounts';
import ProtectedRoute from './components/ProtectedRoute';
import UserTransactions from './components/UserTransactions';
import Login from './components/Loginpage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/banker-login" element={<BankerLogin />} />

      {/* Protected Routes */}
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banker-accounts"
        element={
          <ProtectedRoute>
            <BankerAccounts />
          </ProtectedRoute>
        }
      />
      <Route path="/transactions/:userId" element={<UserTransactions />} />
    </Routes>
  );
}

export default App;