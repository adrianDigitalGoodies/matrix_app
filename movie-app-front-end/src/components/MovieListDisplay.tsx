import React from 'react';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface MovieListDisplayProps {
  movies: Movie[];
}

const MovieListDisplay: React.FC<MovieListDisplayProps> = ({ movies }) => {
  const numColumns = movies.length >= 3 ? 4 : movies.length === 2 ? 6 : 12;
  return (
    <div>
      <Grid container spacing={2} justifyContent="flex-start"> {}
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={numColumns} key={movie.imdbID}>
            <Card>
              {movie.Poster !== 'N/A' && (
                <CardMedia
                  component="img"
                  image={movie.Poster}
                  alt={movie.Title}
                  style={{ height: '350px', objectFit: 'contain' }}
                />
              )}
              <CardContent>
                <Typography variant="h6">{movie.Title} - {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1).toLowerCase()}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {movie.Year}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MovieListDisplay;
