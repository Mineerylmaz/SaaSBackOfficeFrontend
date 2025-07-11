import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Pricing from '../components/Pricing';
import { MemoryRouter } from 'react-router-dom';

// navigate fonksiyonunu mock'layalım
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('Pricing component', () => {
    beforeEach(() => {
        // fetch mocklarını temizle
        jest.restoreAllMocks();
        mockedNavigate.mockClear();
    });

    test('Yüklenme durumu gösterilir', () => {
        // fetch'i durdurup bileşeni render et
        jest.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => { }));

        render(
            <MemoryRouter>
                <Pricing />
            </MemoryRouter>
        );

        expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
    });

    test('Planlar yüklendikten sonra render edilir', async () => {
        const plansMock = [
            {
                id: 1,
                name: 'Basic',
                price: 10,
                features: ['Feature 1', 'Feature 2'],
                rt_url_limit: 5,
                static_url_limit: 10,
            },
            {
                id: 2,
                name: 'Premium',
                price: 20,
                features: ['Feature A', 'Feature B'],
                rt_url_limit: 10,
                static_url_limit: 20,
            },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => plansMock,
        });

        render(
            <MemoryRouter>
                <Pricing />
            </MemoryRouter>
        );

        // Plan isimlerinin görünmesini bekle
        for (const plan of plansMock) {
            expect(await screen.findByText(plan.name)).toBeInTheDocument();
        }
    });

    test('Get Started butonuna tıklanınca user varsa /odeme\'ye yönlendirir', async () => {
        const plansMock = [
            {
                id: 1,
                name: 'Basic',
                price: 10,
                features: [],
                rt_url_limit: 5,
                static_url_limit: 10,
            },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => plansMock,
        });

        // localStorage'a user kaydet
        localStorage.setItem('user', JSON.stringify({ id: 123, email: 'test@test.com' }));

        render(
            <MemoryRouter>
                <Pricing />
            </MemoryRouter>
        );

        const button = await screen.findByText(/get started/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/odeme');
        });

        // Temizle
        localStorage.clear();
    });

    test('Get Started butonuna tıklanınca user yoksa /login\'e yönlendirir', async () => {
        const plansMock = [
            {
                id: 1,
                name: 'Basic',
                price: 10,
                features: [],
                rt_url_limit: 5,
                static_url_limit: 10,
            },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => plansMock,
        });

        // localStorage temiz, user yok
        localStorage.removeItem('user');

        render(
            <MemoryRouter>
                <Pricing />
            </MemoryRouter>
        );

        const button = await screen.findByText(/get started/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/login');
        });
    });
});
