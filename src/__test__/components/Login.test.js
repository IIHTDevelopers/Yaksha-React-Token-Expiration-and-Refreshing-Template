import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Login from '../../components/Login';
import { generateJWT, generateRefreshToken } from '../../utils/authUtils';

jest.mock('../../utils/authUtils', () => ({
  generateJWT: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

describe('boundary', () => {
  it('LoginComponent boundary renders the login form', () => {
    const { getByPlaceholderText, getByRole } = render(<Login />);

    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
    expect(getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('LoginComponent boundary shows alert on invalid credentials', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByPlaceholderText, getByRole } = render(<Login />);
    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(getByRole('button', { name: /login/i }));

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials!');
  });

  it('LoginComponent boundary stores tokens and redirects to dashboard on valid login', () => {
    const history = createMemoryHistory();
    generateJWT.mockReturnValue('fake-jwt-token');
    generateRefreshToken.mockReturnValue('fake-refresh-token');

    const { getByPlaceholderText, getByRole } = render(
      <Router history={history}>
        <Login />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'user' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: /login/i }));

    expect(localStorage.getItem('jwt')).toBe('fake-jwt-token');
    expect(localStorage.getItem('refreshToken')).toBe('fake-refresh-token');
    expect(history.location.pathname).toBe('/dashboard');
  });
});
