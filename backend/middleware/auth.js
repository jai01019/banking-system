//middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Add this line

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await db.query('SELECT * FROM Users WHERE id = ?', [decoded.userId]);
      console.log('Query Result:', rows); // Log the full query result

      const user = rows[0]; // Extract the first row
      console.log('User Object:', user); // Log the user object

      if (!user) throw new Error();

      console.log('User Role:', user.role); // Log the role value
      console.log('Allowed Roles:', roles); // Log the allowed roles

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).send({ error: 'Access denied' });
      }

      req.user = user;
      next();
    } catch (e) {
      res.status(401).send({ error: 'Please authenticate' });
    }
  };
};

module.exports = auth;


