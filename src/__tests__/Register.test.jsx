import React from 'react';
import '@testing-library/jest-dom';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Register';
import { MemoryRouter } from 'react-router-dom';


const mockNavigate = jest.fn();
const mockSetUser = jest.fn();


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));


global.fetch = jest.fn();

describe('Register Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Form alanları ekranda gözüküyor', () => {
        render(
            <MemoryRouter>
                <Register setUser={mockSetUser} />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Firstname/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Lastname/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('Form inputları değiştiğinde state güncelleniyor', () => {
        render(
            <MemoryRouter>
                <Register setUser={mockSetUser} />
            </MemoryRouter>
        );

        const firstnameInput = screen.getByPlaceholderText(/Firstname/i);
        fireEvent.change(firstnameInput, { target: { value: 'John' } });
        expect(firstnameInput.value).toBe('John');

        const emailInput = screen.getByPlaceholderText(/Email/i);
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        expect(emailInput.value).toBe('john@example.com');
    });

    test('Başarılı kayıt ve login sonrası setUser çağrılır ve navigate yapılır', async () => {
        render(
            <MemoryRouter>
                <Register setUser={mockSetUser} />
            </MemoryRouter>
        );


        fetch
            .mockResolvedValueOnce({
                ok: true,
            })

            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    id: 1,
                    email: 'john@example.com',
                    role: 'free',
                    plan: 'free',
                    token: 'token123',
                }),
            });

        fireEvent.change(screen.getByPlaceholderText(/Firstname/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText(/Lastname/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123456' } });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(mockSetUser).toHaveBeenCalledWith({
                id: 1,
                email: 'john@example.com',
                role: 'free',
                plan: 'free',
                token: 'token123',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    test('Register başarısız olursa alert gösterilir', async () => {
        window.alert = jest.fn();

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Email zaten kayıtlı' }),
        });

        render(
            <MemoryRouter>
                <Register setUser={mockSetUser} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Firstname/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText(/Lastname/i), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123456' } });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Hata: Email zaten kayıtlı');
            expect(mockSetUser).not.toHaveBeenCalled();
        });
    });

});
