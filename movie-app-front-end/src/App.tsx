import React, { useState } from 'react';
import FetchButton from './components/FetchButton';
import MovieListDisplay from './components/MovieListDisplay';
import MovieSort from './components/MovieSort';
import { Box, TextField } from '@mui/material';
import './styles/App.css';
import './styles/ButtonStyles.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/SearchBarStyles.css';
import './styles/FetchButton.css';


interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sortField, setSortField] = useState<keyof Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const theme = createTheme({
    palette: {
      primary: {
        main: '#4caf50',
      },
    },
  });

  const fetchMoviesByURL = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const sortMovies = (field: keyof Movie, ascending: boolean) => {
    setMovies([...movies].sort((a, b) => {
      const comparison = a[field].localeCompare(b[field]);
      return ascending ? comparison : -comparison;
    }));
    setSortField(field);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredMovies = movies.filter(movie =>
    movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box textAlign="center" minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgcolor="#121212">
        <h1 style={{ color: '#ffffff', marginBottom: '2rem', fontSize: "4rem" }}>Matrix Flix</h1>
        <Box display="flex" justifyContent="center" marginBottom="4rem">
          <FetchButton
            label="Matrix"
            url="http://localhost:5000/api/fetch-movies/Matrix"
            onClick={() => fetchMoviesByURL("http://localhost:5000/api/fetch-movies/Matrix")}
          />
          <FetchButton
            label="Matrix Reloaded"
            url="http://localhost:5000/api/fetch-movies/Matrix%20Reloaded"
            onClick={() => fetchMoviesByURL("http://localhost:5000/api/fetch-movies/Matrix%20Reloaded")}
          />
          <FetchButton
            label="Matrix Revolutions"
            url="http://localhost:5000/api/fetch-movies/Matrix%20Revolutions"
            onClick={() => fetchMoviesByURL("http://localhost:5000/api/fetch-movies/Matrix%20Revolutions")}
          />
        </Box>
        <TextField
          label="Search Movies"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            style: { color: '#4caf50', borderColor: '#4caf50' },
            placeholder: 'Search Movies',
          }}
          style={{ marginBottom: '1rem', width: '300px' }}
        />
        <MovieSort sortField={sortField} setSortField={setSortField} onSort={sortMovies} />
        <MovieListDisplay movies={filteredMovies} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
