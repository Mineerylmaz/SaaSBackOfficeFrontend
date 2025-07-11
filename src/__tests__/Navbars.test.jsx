import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbars from '../components/Navbars'
import { MemoryRouter } from 'react-router-dom';

describe('Navbar component', () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Navbars />
            </MemoryRouter>
        );
    });

    test('Navbar render ediliyor', () => {
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('Tüm linkler doğru render ediliyor', () => {
        expect(screen.getByText('Home')).toBeInTheDocument();

    });

    test('Linklerin href attribute değerleri doğru', () => {
        expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home');

    });
});
