import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Odeme from '../components/Odeme';
import Swal from 'sweetalert2';

// fetch mock
global.fetch = jest.fn();

// localStorage mock
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        clear: jest.fn(() => { store = {}; }),
        removeItem: jest.fn((key) => { delete store[key]; }),
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

describe('Odeme bileşeni', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();

        // LocalStorage içine user ve selectedPlan koy
        localStorage.getItem.mockImplementation((key) => {
            if (key === 'user') {
                return JSON.stringify({ id: 123, plan: { name: 'Basic', price: 10 } });
            }
            if (key === 'selectedPlan') {
                return JSON.stringify({ name: 'Premium', price: 20 });
            }
            return null;
        });

        // fetch mock başarılı yanıt dönsün
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({}),
            status: 200,
        });
    });

    test('Seçilen plan ve fiyatı render eder', async () => {
        render(<Odeme />);
        expect(await screen.findByText(/Seçilen Plan: Premium/i)).toBeInTheDocument();
        expect(screen.getByText(/Fiyat: \$20/i)).toBeInTheDocument();
    });

    test('Ödeme butonuna tıklayınca fetch çağrılır ve swal success gösterilir', async () => {
        render(<Odeme />);
        const payButton = await screen.findByRole('button', { name: /öde/i });

        fireEvent.click(payButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:32807/api/adminpanel/update-user-plan/123',
                expect.objectContaining({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan: 'Premium' }),
                })
            );
        });

        expect(Swal.fire).toHaveBeenCalledWith('Başarılı', 'Ödeme alındı: Premium', 'success');

        // LocalStorage güncelleme kontrolü
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'user',
            expect.stringContaining('"plan":{"name":"Premium","price":20}')
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'selectedPlan',
            expect.stringContaining('"name":"Premium"')
        );
    });

    test('userId veya plan yoksa hata Swal gösterir', async () => {
        // userId yoksa
        localStorage.getItem.mockImplementation(() => null);

        render(<Odeme />);
        const payButton = screen.queryByRole('button', { name: /öde/i });
        // plan yoksa
        // Wait for component to render
        await waitFor(() => {
            expect(screen.queryByText(/Seçilen plan bulunamadı./i)).toBeInTheDocument();
        });

        if (payButton) {
            fireEvent.click(payButton);
            await waitFor(() => {
                expect(Swal.fire).toHaveBeenCalledWith('Hata', 'Kullanıcı veya plan bilgisi eksik.', 'error');
            });
        }
    });

    test('fetch başarısız olursa hata konsola yazılır', async () => {
        fetch.mockRejectedValueOnce(new Error('Fetch failed'));
        console.error = jest.fn();

        render(<Odeme />);
        const payButton = await screen.findByRole('button', { name: /öde/i });

        fireEvent.click(payButton);

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('Plan güncelleme hatası:'),
                expect.any(Error)
            );
        });
    });

});
