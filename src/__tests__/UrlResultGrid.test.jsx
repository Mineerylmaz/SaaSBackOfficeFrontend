import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UrlResultsGrid from '../components/UrlResultsGrid';

global.fetch = jest.fn();
jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve()),
}));

describe('UrlResultsGrid', () => {
    const fakeResults = [
        {
            id: 1,
            name: 'Test URL',
            url: 'https://example.com',
            responseTime: 123,
            status: 'success',
            errorMessage: '',
            checkedAt: new Date().toISOString(),
        },
        {
            id: 2,
            name: '',
            url: 'https://example.org',
            responseTime: 456,
            status: 'error',
            errorMessage: 'Connection refused',
            checkedAt: new Date().toISOString(),
        },
    ];

    beforeEach(() => {
        fetch.mockClear();
    });

    it('fetch çağrısı yapar ve sonuçları gösterir', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fakeResults,
        });

        render(<UrlResultsGrid userId={42} />);

        // DataGrid yüklenmesi için bekle
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/userSettings/urlResults/42')
            );
        });

        // Başlık hücresi render edildi mi?
        expect(screen.getByText(/başlık/i)).toBeInTheDocument();

        // URL verileri render edildi mi?
        expect(await screen.findByText('Test URL')).toBeInTheDocument();
        expect(await screen.findByText('https://example.org')).toBeInTheDocument();
    });

    it('Filtrele butonu fetch çağrısını tetikler', async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => fakeResults,
        });

        render(<UrlResultsGrid userId={42} />);

        // İlk fetch
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        const button = screen.getByText(/filtrele/i);

        fireEvent.click(button);

        // Filtrele butonuna basınca fetch tekrar çağrılır
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });
    });
});
