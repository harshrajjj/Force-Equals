const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key'; 

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const users = [
  {
    id: 1,
    username: 'user1',
    password: 'pass123'
  }
];

const companies = [
  { id: 1, name: 'Acme Inc', matchScore: 85, status: 'Prospect' },
  { id: 2, name: 'Beta Corp', matchScore: 92, status: 'Prospect' },
  { id: 3, name: 'Gamma LLC', matchScore: 78, status: 'Prospect' },
  { id: 4, name: 'Delta Co', matchScore: 65, status: 'Prospect' },
  { id: 5, name: 'Epsilon Ltd', matchScore: 88, status: 'Prospect' }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (password !== user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    message: 'Login successful',
    token
  });
});

// Get accounts endpoint
app.get('/accounts', authenticateToken, (req, res) => {
  res.json(companies);
});

// Update account status endpoint
app.post('/accounts/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const company = companies.find(c => c.id === parseInt(id));
  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  if (!['Target', 'Prospect', 'Customer', 'Archived'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  company.status = status;

  res.json({
    message: 'Status updated successfully',
    company
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
