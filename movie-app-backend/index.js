// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const moviesRouter = require('./routes/movies');

app.use(cors());
app.use(express.json());

// Mount the movies router
app.use('/api', moviesRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
