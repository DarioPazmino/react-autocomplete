import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event'
import Autocomplete from './Autocomplete';

test('autocomplete component displays a search field and an empty list', () => {
  render(<Autocomplete />);
  const searchInput = screen.getByRole('textbox', { name: /Find a University:/i });
  const resultsList = screen.getByTestId('suggestions');
  const results = screen.queryAllByTestId('suggestion');

  expect(searchInput).toBeInTheDocument();
  expect(resultsList).toBeInTheDocument();
  expect(results).toHaveLength(0);
});

test('user searchs for a university and list displays with suggestions', async () => {
  render(<Autocomplete />);
  const searchInput = screen.getByRole('textbox', { name: /find a university:/i });
  const resultsList = screen.getByTestId('suggestions');
  
  await user.click(searchInput);
  await user.keyboard('Miami');

  const results = await screen.findAllByTestId('suggestion');

  expect(resultsList).toBeInTheDocument();
  expect(results).toHaveLength(3);
});

test('autocomplete selection updates input value and displays details', async () => {
  render(<Autocomplete />);
  const searchInput = screen.getByRole('textbox', { name: /find a university:/i });

  await user.click(searchInput);
  await user.keyboard('Miami');

  const result = await screen.findByText('Miami University of Ohio');
  await user.click(result);

  const infoBox = await screen.findByTestId('option-details');

  expect(searchInput).toHaveValue('Miami University of Ohio');
  expect(infoBox).toBeInTheDocument();
  expect(result).not.toBeInTheDocument();
})