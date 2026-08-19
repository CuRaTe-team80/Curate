const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const samplesRouter = require('./routes/samples');
app.use('/samples', samplesRouter);

app.get('/', (req, res) => res.send('Curate API running'));
module.exports = app;