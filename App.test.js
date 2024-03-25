import { render } from '@testing-library/react-native';
import App from './App';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('App Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    
    expect(getByText('Stocks')).toBeTruthy();
  });
  
});
