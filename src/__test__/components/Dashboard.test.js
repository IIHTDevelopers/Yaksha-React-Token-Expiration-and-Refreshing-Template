import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Dashboard from '../../components/Dashboard';
import { isExpiredToken, refreshToken } from '../../utils/authUtils';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../utils/authUtils', () => ({
    isExpiredToken: jest.fn(),
    refreshToken: jest.fn(),
}));

describe('boundary', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('DashboardComponent boundary redirects to login if the token is expired and refresh fails', async () => {
        const history = createMemoryHistory();
        isExpiredToken.mockReturnValue(true);
        refreshToken.mockReturnValue(null); // Simulate failed token refresh

        const { getByText } = render(
            <Router history={history}>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(getByText('Session expired. Redirecting to login...')).toBeInTheDocument();
        });

        await waitFor(() => expect(history.location.pathname).toBe('/login'), { timeout: 2100 });
    });

    it('DashboardComponent boundary refreshes token if the token is expired but refresh succeeds', async () => {
        const history = createMemoryHistory();
        isExpiredToken.mockReturnValue(true);
        refreshToken.mockReturnValue('new-jwt-token'); // Simulate successful token refresh

        const { getByText } = render(
            <Router history={history}>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(localStorage.getItem('jwt')).toBe('new-jwt-token');
            expect(getByText('Dashboard')).toBeInTheDocument();
            expect(getByText('Welcome to the Dashboard')).toBeInTheDocument();
        });
    });

    it('DashboardComponent boundary logs out and redirects to login on Logout button click', async () => {
        const history = createMemoryHistory();
        isExpiredToken.mockReturnValue(false);

        const { getByText } = render(
            <Router history={history}>
                <Dashboard />
            </Router>
        );

        fireEvent.click(getByText('Logout'));

        await waitFor(() => {
            expect(localStorage.getItem('jwt')).toBeNull();
            expect(localStorage.getItem('refreshToken')).toBeNull();
            expect(history.location.pathname).toBe('/login');
        });
    });
});
