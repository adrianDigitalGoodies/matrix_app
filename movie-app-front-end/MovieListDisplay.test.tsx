import { render, screen } from '@testing-library/react';
import MovieListDisplay from './src/components/MovieListDisplay';

const mockMovies = [
  {
    imdbID: '1',
    Title: 'Movie 1',
    Year: '2021',
    Poster: 'poster1.jpg',
    Type: 'Movie',
  },
  {
    imdbID: '2',
    Title: 'Movie 2',
    Year: '2022',
    Poster: 'poster2.jpg',
    Type: 'Movie',
  },
];

test('renders movie cards with correct information', () => {
  render(<MovieListDisplay movies={mockMovies} />);
  
  const movie1Title = screen.getByText(/Movie 1/i);
  const movie1Year = screen.getByText(/2021/i);
  const movie1Poster = screen.getByAltText(/Movie 1/i);

  const movie2Title = screen.getByText(/Movie 2/i);
  const movie2Year = screen.getByText(/2022/i);
  const movie2Poster = screen.getByAltText(/Movie 2/i);

  expect(movie1Title).toBeInTheDocument();
  expect(movie1Year).toBeInTheDocument();
  expect(movie1Poster).toBeInTheDocument();
  expect(movie1Poster).toHaveAttribute('src', 'poster1.jpg');

  expect(movie2Title).toBeInTheDocument();
  expect(movie2Year).toBeInTheDocument();
  expect(movie2Poster).toBeInTheDocument();
  expect(movie2Poster).toHaveAttribute('src', 'poster2.jpg');
});
