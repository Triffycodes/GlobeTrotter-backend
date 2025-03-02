// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Add this near your other route registrations


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Import routes
const destinationRoutes = require('./routes/destinations');
const userRoutes = require('./routes/users');

// Mount routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/users', userRoutes);

// Optional root route for testing
app.get('/', (req, res) => {
  res.send('Backend API is running.');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
