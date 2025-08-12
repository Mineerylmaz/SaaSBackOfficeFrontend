import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../components/Settings';

global.fetch = jest.fn();
jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve()),
}));


describe('Settings component', () => {
    const fakeUser = { id: 1, name: 'Test User' };

    beforeEach(() => {
        fetch.mockClear();
    });

    it('yüklenme sırasında yükleniyor mesajı gösterir', () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ settings: {}, plan: null }),
        });

        render(<Settings user={fakeUser} />);
        expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
    });

    it('plan yoksa uyarı mesajı gösterir', async () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ settings: {}, plan: null }),
        });

        render(<Settings user={fakeUser} />);
        await waitFor(() => {
            expect(screen.getByText(/ödenmiş plan bulunamadı/i)).toBeInTheDocument();
        });
    });

    it('RT URL ekleme butonunu render eder', async () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                settings: { rt_urls: [], static_urls: [] },
                plan: { name: 'Pro', rt_url_limit: 5, static_url_limit: 3 },
            }),
        });

        render(<Settings user={fakeUser} />);

        await waitFor(() => {
            expect(screen.getByText(/real time url listesi/i)).toBeInTheDocument();
        });

        const addButton = screen.getByText(/url ekle/i);
        expect(addButton).toBeInTheDocument();
    });



});
