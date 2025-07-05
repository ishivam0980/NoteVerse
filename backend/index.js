import express from 'express';
import connectDB from './db.js';
import cors from 'cors';

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json()); 

// Routes

import auth from './routes/auth.js';
import notes from './routes/notes.js';

// Use routes
app.use('/api/auth', auth);
app.use('/api/notes', notes);

// Default route
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Noteverse API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

//unhandled routes
app.use((req, res) => {
  res.status(404).json({ message: `Sorry, ${req.originalUrl} not found!` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


