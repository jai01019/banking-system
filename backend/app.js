require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const accountRoutes = require('./routes/accounts');

app.use('/api/auth', authRoutes); 
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));