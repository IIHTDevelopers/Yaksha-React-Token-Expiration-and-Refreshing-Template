import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import Home from '../components/Home';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import { isExpiredToken } from '../utils/authUtils';
import '@testing-library/jest-dom/extend-expect';

// Mock the components and utilities
jest.mock('../components/Home', () => () => <div>Home Component</div>);
jest.mock('../components/Login', () => () => <div>Login Component</div>);
jest.mock('../components/Dashboard', () => () => <div>Dashboard Component</div>);
jest.mock('../utils/authUtils', () => ({
  isExpiredToken: jest.fn(),
}));

describe('boundary', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('AppComponent boundary renders the Home component by default', () => {
    const { getByText } = render(
      <Router>
        <App />
      </Router>
    );
    expect(getByText('Home Component')).toBeInTheDocument();
  });

  it('AppComponent boundary navigates to the Login component', () => {
    const { getByText } = render(
      <Router>
        <App />
      </Router>
    );
    fireEvent.click(getByText('Login'));
    expect(getByText('Login Component')).toBeInTheDocument();
  });

  it('AppComponent boundary navigates to the Dashboard component when logged in', () => {
    // Mock the isLoggedIn state to be true
    isExpiredToken.mockReturnValue(false);
    localStorage.setItem('jwt', 'validToken');

    const { getByText } = render(
      <Router>
        <App />
      </Router>
    );
    fireEvent.click(getByText('Dashboard'));
    expect(getByText('Dashboard Component')).toBeInTheDocument();

    // Cleanup
    localStorage.removeItem('jwt');
  });

  it('AppComponent boundary logs the user out if the token is expired', () => {
    // Mock the token to be expired
    isExpiredToken.mockReturnValue(true);
    localStorage.setItem('jwt', 'expiredToken');

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    render(
      <Router>
        <App />
      </Router>
    );

    expect(localStorage.getItem('jwt')).toBeNull();
    expect(window.location.href).toContain('/login');
  });

  it('AppComponent boundary renders the Logout button when logged in and logs out on click', () => {
    // Mock the isLoggedIn state to be true
    isExpiredToken.mockReturnValue(false);
    localStorage.setItem('jwt', 'validToken');

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    const { getByText } = render(
      <Router>
        <App />
      </Router>
    );

    fireEvent.click(getByText('Logout'));
    expect(localStorage.getItem('jwt')).toBeNull();
    expect(window.location.href).toContain('/login');

    // Cleanup
    localStorage.removeItem('jwt');
  });
});
