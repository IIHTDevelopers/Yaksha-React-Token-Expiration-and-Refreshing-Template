import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../components/Home';
import '@testing-library/jest-dom/extend-expect';

describe('boundary', () => {
    it('HomeComponent boundary renders the Home component', () => {
        const { getByText } = render(<Home />);

        expect(getByText('JWT Authentication System')).toBeInTheDocument();
    });
});
