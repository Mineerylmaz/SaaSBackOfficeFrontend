import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserDataGrid from '../components/UserDataGrid';
import Swal from 'sweetalert2';

// SweetAlert mock
jest.mock('sweetalert2', () => ({
    fire: jest.fn().mockResolvedValue({}),
}));

global.fetch = jest.fn();

describe('UserDataGrid', () => {
    const fakeUsers = [
        { id: 1, email: 'user1@test.com', plan: 'Basic', last_login: new Date().toISOString(), created_at: new Date().toISOString() },
        { id: 2, email: 'user2@test.com', plan: 'Pro', last_login: null, created_at: new Date().toISOString() },
    ];

    const fakeDeletedUsers = [
        { id: 3, email: 'deleted@test.com', plan: 'Basic', last_login: null, created_at: new Date().toISOString() },
    ];

    beforeEach(() => {
        fetch.mockClear();
        Swal.fire.mockClear();
    });

    it('kullanıcıları yükler ve tabloyu render eder', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeUsers,
        });

        render(<UserDataGrid />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/adminpanel/list-users');
        });

        // E-posta hücreleri render edildi mi?
        expect(await screen.findByText('user1@test.com')).toBeInTheDocument();
        expect(await screen.findByText('user2@test.com')).toBeInTheDocument();
    });

    it('hiçbir seçim yoksa Delete Selected uyarı gösterir', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeUsers,
        });

        render(<UserDataGrid />);

        await waitFor(() => screen.getByText('user1@test.com'));

        const deleteButton = screen.getByRole('button', { name: /delete selected/i });
        fireEvent.click(deleteButton);

        expect(Swal.fire).toHaveBeenCalledWith('No Selection', 'Please select at least one user.', 'warning');
    });

    it('Show Deleted Users butonu deleted-users endpointini çağırır', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeUsers,
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeDeletedUsers,
        });

        render(<UserDataGrid />);

        await waitFor(() => screen.getByText('user1@test.com'));

        const showDeletedButton = screen.getByRole('button', { name: /show deleted users/i });
        fireEvent.click(showDeletedButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/adminpanel/deleted-users');
        });

        expect(await screen.findByText('deleted@test.com')).toBeInTheDocument();
    });

    it('Hide Deleted Users eski kullanıcıları geri yükler', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => fakeUsers,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => fakeDeletedUsers,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => fakeUsers,
            });

        render(<UserDataGrid />);

        await waitFor(() => screen.getByText('user1@test.com'));

        const showDeletedButton = screen.getByRole('button', { name: /show deleted users/i });
        fireEvent.click(showDeletedButton);

        await waitFor(() => screen.getByText('deleted@test.com'));

        const hideDeletedButton = screen.getByRole('button', { name: /hide deleted users/i });
        fireEvent.click(hideDeletedButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/adminpanel/list-users');
        });

        expect(await screen.findByText('user1@test.com')).toBeInTheDocument();
    });
});
