const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const moviesRouter = require('./routes/movies');
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve the static front-end files from the 'build' folder
app.use(express.static(path.join(__dirname, '../movie-app-front-end/build')));

app.use('/api', moviesRouter);

// Handle any remaining requests by serving the front-end app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../movie-app-front-end/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
