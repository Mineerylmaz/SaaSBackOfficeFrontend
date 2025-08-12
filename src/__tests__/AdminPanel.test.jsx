import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AdminPanel from '../components/AdminPanel';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve()),
}));

beforeEach(() => {
    global.fetch = jest.fn((url) => {
        if (url.includes('/list-users')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(fakeUsers),
            });
        }
        if (url.includes('/pricing')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            });
        }
        return Promise.reject(new Error('Unknown endpoint'));
    });
});

describe('AdminPanel basit testler', () => {
    const fakeUsers = [
        { id: 1, email: 'user1@example.com', plan: 'basic', last_login: null, created_at: null },
        { id: 2, email: 'user2@example.com', plan: 'pro', last_login: null, created_at: null },
    ];

    const fakePricing = [
        { id: 1, name: 'Basic', price: 10, features: ['f1', 'f2'], rt_url_limit: 5, static_url_limit: 5 },
    ];

    beforeEach(() => {
        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => fakeUsers,
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => fakePricing,
            });
    });

    test('AdminPanel render ve Dashboard tab başlık kontrolü', async () => {
        render(
            <MemoryRouter>
                <AdminPanel />
            </MemoryRouter>
        );

        // "Yükleniyor" yazısı kontrolü
        expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();

        // Dashboard tab içindeki başlık, heading rolüyle tam isimle arayalım
        const heading = await screen.findByRole('heading', { name: /^dashboard$/i });
        expect(heading).toBeInTheDocument();

        // Toplam kullanıcı sayısını içerdiğini kontrol et
        expect(screen.getByText(fakeUsers.length.toString())).toBeInTheDocument();
    });



    test('Fiyatlar tabına geçiş ve fiyat planı inputu kontrolü', async () => {
        render(
            <MemoryRouter>
                <AdminPanel />
            </MemoryRouter>
        );

        const pricingTab = await screen.findByRole('button', { name: /fiyatları kontrol et/i });
        fireEvent.click(pricingTab);

        // Sekme başlığını bul (heading)
        const heading = await screen.findByRole('heading', { name: /fiyatları kontrol et/i });
        expect(heading).toBeInTheDocument();

        // Plan adı inputunu bul (placeholder veya value ile arama yapabiliriz)
        const planNameInput = screen.getByDisplayValue(fakePricing[0].name);
        expect(planNameInput).toBeInTheDocument();
    });
});
