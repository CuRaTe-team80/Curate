const express = require('express');
const app = express();
app.use(express.json());

const samplesRouter = require('./routes/samples');
app.use('/samples', samplesRouter);

app.get('/', (req, res) => res.send('Curate API running'));
module.exports = app;