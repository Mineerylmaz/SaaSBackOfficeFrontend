import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingTab from '../components/SettingTab';
import '@testing-library/jest-dom';
import Swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
});

afterAll(() => {
    global.fetch.mockRestore();
});


beforeEach(() => {
    jest.resetAllMocks();
    // global fetch mock
    global.fetch = jest.fn();
});

afterAll(() => {
    global.fetch.mockRestore();
});

describe('SettingTab Component', () => {
    const mockKeys = [
        { id: 1, key_name: 'tema', type: 'string', description: 'Tema seçimi' },
        { id: 2, key_name: 'dil', type: 'string', description: 'Dil seçimi' },
    ];

    test('İlk yüklemede fetchKeys çağrılır ve liste gösterilir', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockKeys,
        });

        render(<SettingTab></SettingTab>);

        expect(screen.getByText(/Yükleniyor/i)).toBeInTheDocument();

        // Liste tamamlanınca öğeler görünmeli
        for (const key of mockKeys) {
            await waitFor(() => {
                expect(screen.getByText(key.key_name)).toBeInTheDocument();
                expect(screen.getAllByText(key.type).length).toBeGreaterThan(0);

                expect(screen.getByText(key.description)).toBeInTheDocument();
            });
        }
    });

    test('Yeni key ekleme modalı açılıp kapanır', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(<SettingTab />);

        // Başlangıçta modal yok
        expect(screen.queryByText(/Yeni Key Ekle/i)).not.toBeInTheDocument();

        // Butona tıkla modal açılsın
        fireEvent.click(screen.getByTitle('Yeni Key Ekle'));

        expect(screen.getByText(/Yeni Key Ekle/i)).toBeInTheDocument();

        // Modal iptal butonuna tıkla kapanmalı
        fireEvent.click(screen.getByText('İptal'));

        await waitFor(() => {
            expect(screen.queryByText(/Yeni Key Ekle/i)).not.toBeInTheDocument();
        });
    });

    test('Boş key eklemeye çalışınca alert gösterir', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        window.alert = jest.fn();

        render(<SettingTab />);

        fireEvent.click(screen.getByTitle('Yeni Key Ekle'));

        // Key input boş, ekle butonuna tıkla
        fireEvent.click(screen.getByText('Ekle'));

        expect(window.alert).toHaveBeenCalledWith('Key boş olamaz!');
    });



    test('Başarılı yeni key ekleme isteği gönderilir', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockKeys,
            });

        const Swal = require('sweetalert2');
        Swal.fire.mockClear();

        render(<SettingTab />);

        fireEvent.click(screen.getByTitle('Yeni Key Ekle'));

        fireEvent.change(screen.getByPlaceholderText('Key adı'), {
            target: { value: 'yeniKey' },
        });
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'string' } });


        fireEvent.change(screen.getByPlaceholderText('Açıklama (description)'), {
            target: { value: 'Test açıklaması' },
        });

        fireEvent.click(screen.getByText('Ekle'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/setting-key', expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key_name: 'yeniKey',
                    type: 'string',
                    description: 'Test açıklaması',
                }),
            }));
        });

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith('Başarılı!', 'Key başarıyla eklendi.', 'success');
            expect(screen.queryByText(/Yeni Key Ekle/i)).not.toBeInTheDocument();
        });
    });
});
