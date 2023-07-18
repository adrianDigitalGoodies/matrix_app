import React from 'react';
import './sortButtonStyles.css';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface MovieSortProps {
  sortField: keyof Movie | null;
  setSortField: React.Dispatch<React.SetStateAction<keyof Movie | null>>;
  onSort: (field: keyof Movie, ascending: boolean) => void;
}

const MovieSort: React.FC<MovieSortProps> = ({ sortField, setSortField, onSort }) => {
  const handleSort = (field: keyof Movie, ascending: boolean) => {
    onSort(field, ascending);
  };

  return (
    <div className="sortButtonContainer">
      <button className="sortButton" onClick={() => handleSort('Title', true)}>
        Sort by Title (A-Z)
      </button>
      <button className="sortButton" onClick={() => handleSort('Title', false)}>
        Sort by Title (Z-A)
      </button>
      <button className="sortButton" onClick={() => handleSort('Year', true)}>
        Sort by Year (Ascending)
      </button>
      <button className="sortButton" onClick={() => handleSort('Year', false)}>
        Sort by Year (Descending)
      </button>
    </div>
  );
};

export default MovieSort;
