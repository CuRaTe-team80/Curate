const express = require('express');
const app = express();

app.use(express.json());

// Samples routes
const samplesRouter = require('./routes/samples');
app.use('/samples', samplesRouter);

// Authentication routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Curate API running');
});

module.exports = app;