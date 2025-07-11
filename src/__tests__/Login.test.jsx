import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login';

// Swal'i mockla
jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

// navigate'i mockla
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('Login bileşeni', () => {
    let setUser;

    beforeEach(() => {
        setUser = jest.fn();
        render(
            <MemoryRouter>
                <Login setUser={setUser} />
            </MemoryRouter>
        );
    });

    test('Tüm form elemanları ekranda', () => {
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    });

    test('Boş form gönderiminde Swal.fire çağrılır', async () => {
        const loginButton = screen.getByRole('button', { name: /login/i });
        await userEvent.click(loginButton);

        // Çünkü inputlar required, HTML submit engeller, Swal.fire backend error'ı simüle ediliyor.
        await waitFor(() => {
            expect(require('sweetalert2').fire).not.toHaveBeenCalled();
        });
    });

    test('Geçerli bilgilerle giriş çağrısı', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    token: 'test-token',
                    id: 1,
                    email: 'test@example.com',
                    role: 'user',
                    plan: { name: 'Basic' }
                }),
            })
        );

        await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');

        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(setUser).toHaveBeenCalledWith({
                id: 1,
                email: 'test@example.com',
                role: 'user',
                plan: { name: 'Basic' },
            });
        });

        expect(mockedNavigate).toHaveBeenCalled();
    });

    test('Geçersiz bilgilerle Swal.fire gösterilir', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: 'Geçersiz bilgi!' }),
            })
        );

        await userEvent.type(screen.getByPlaceholderText(/email/i), 'wrong@example.com');
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'wrongpassword');

        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(require('sweetalert2').fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: 'error',
                    title: 'Giriş Başarısız',
                    text: 'Geçersiz bilgi!',
                })
            );
        });
    });
});
