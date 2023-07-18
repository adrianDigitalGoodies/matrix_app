const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const OMDB_API_KEY = '55adf014';

const db = new sqlite3.Database('./movies.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      imdbID TEXT PRIMARY KEY,
      Title TEXT,
      Year TEXT,
      PosterID INTEGER,
      Type TEXT,
      FOREIGN KEY (PosterID) REFERENCES posters(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS posters (
      id INTEGER PRIMARY KEY,
      Poster TEXT
    )
  `);
});

router.get('/fetch-movies/:searchQuery', async (req, res) => {
  console.log('Received request to fetch movies');
  const searchQuery = req.params.searchQuery;
  const url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=${OMDB_API_KEY}`;

  try {
    const response = await axios.get(url);
    const movies = response.data.Search || [];

    db.serialize(async () => {
      db.run('BEGIN TRANSACTION');

      const insertStmtMovie = db.prepare(`
        INSERT OR IGNORE INTO movies (imdbID, Title, Year, PosterID, Type) VALUES (?, ?, ?, ?, ?)
      `);

      const selectStmtPoster = db.prepare(`
        SELECT id FROM posters WHERE Poster = ?
      `);

      const insertStmtPoster = db.prepare(`
        INSERT OR IGNORE INTO posters (Poster) VALUES (?)
      `);

      for (const movie of movies) {
        if (movie.Poster) {
          try {
            // Check if the poster exists in the 'posters' table
            const posterData = await getPosterID(selectStmtPoster, movie.Poster);

            if (posterData) {
              // Use the existing poster's ID
              const { id } = posterData;
              insertMovie(insertStmtMovie, movie.imdbID, movie.Title, movie.Year, id, movie.Type);
            } else {
              // Insert the poster into the 'posters' table and get its ID
              const { lastID } = await insertPoster(insertStmtPoster, movie.Poster);

              // Insert the movie into the 'movies' table, using the posterID as a foreign key
              insertMovie(insertStmtMovie, movie.imdbID, movie.Title, movie.Year, lastID, movie.Type);
            }
          } catch (error) {
            console.error('Error inserting poster or movie:', error);
          }
        } else {
          // Insert the movie into the 'movies' table with PosterID set to NULL
          insertMovie(insertStmtMovie, movie.imdbID, movie.Title, movie.Year, null, movie.Type);
        }
      }

      // Finalize the prepared statements
      insertStmtMovie.finalize();
      selectStmtPoster.finalize();
      insertStmtPoster.finalize();

      // Commit the transaction
      db.run('COMMIT', (err) => {
        if (err) {
          // Rollback the transaction in case of an error
          db.run('ROLLBACK');
          res.status(500).json({ error: 'Error committing transaction' });
        } else {
          res.json(movies);
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movie data' });
  }
});

// Helper function to check if the poster already exists in the 'posters' table
function getPosterID(statement, poster) {
  return new Promise((resolve, reject) => {
    statement.get(poster, function (err, row) {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to insert poster and return its ID
function insertPoster(statement, poster) {
  return new Promise((resolve, reject) => {
    statement.run(poster, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID });
      }
    });
  });
}

// Helper function to insert movie data
function insertMovie(statement, imdbID, title, year, posterID, type) {
  statement.run(imdbID, title, year, posterID, type);
}

// Route to get all movies from the database
router.get('/movies', (req, res) => {
  db.all(`
    SELECT movies.imdbID, movies.Title, movies.Year, movies.Type, posters.Poster
    FROM movies
    LEFT JOIN posters ON movies.PosterID = posters.id
  `, (err, movies) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching movies' });
    } else {
      res.json(movies);
    }
  });
});

module.exports = router;
