import React from 'react';

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sonuc from '../components/Sonuc';
import '@testing-library/jest-dom';

global.fetch = jest.fn();
jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve()),
}));

describe('Sonuc', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    test('gerekli ayar yoksa hata mesajı gösterir', async () => {
        render(<MemoryRouter>
            <Sonuc />
        </MemoryRouter>);
        const uyarımesaji = await screen.queryByText('Bu sayfa için gerekli ayarlar yapılmamış!');
        expect(uyarımesaji).toBeInTheDocument();


    });




});