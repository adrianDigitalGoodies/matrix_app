import { render, screen, act } from '@testing-library/react';
import App from './App';

test('renders FetchButtons', () => {
  act(() => {
    render(<App />);
  });

  const matrixReloadedButton = screen.getByText(/Matrix Reloaded/i);
  const matrixRevolutionsButton = screen.getByText(/Matrix Revolutions/i);

  expect(matrixReloadedButton).toBeInTheDocument();
  expect(matrixRevolutionsButton).toBeInTheDocument();
});
