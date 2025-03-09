const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');



dotenv.config();

const app = express();
app.use(express.json()); // This is needed to parse JSON body
// Define the CORS options
const corsOptions = {
  origin: 'http://localhost:3003',  // Frontend URL (React app running on localhost:3000)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  credentials: true,  // Allow credentials such as cookies
};

// Middleware
app.use(cors(corsOptions));  // Apply the CORS middleware with specific options

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
