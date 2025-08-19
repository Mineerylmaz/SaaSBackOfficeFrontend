import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Roller from '../components/Roller';


describe('Roller component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders Davet gönder alanı', () => {
        render(<Roller />);
        expect(screen.getByText(/ Davet Et/i)).toBeInTheDocument();
    });

    test('show error if email is empty on invite', async () => {
        render(<Roller />);
        const button = screen.getByText(/Davet Et/i);
        fireEvent.click(button);
        expect(await screen.findByText(/Email ve rol seçiniz/i)).toBeInTheDocument();
    });


});
