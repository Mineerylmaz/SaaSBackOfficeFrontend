import React from "react";
import { render, screen } from '@testing-library/react';
import Profile from '../components/Profile';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
const mockUser = {
    id: 1,
    firstname: "mine",
    lastname: "eryilmaz",
    email: "mine@mail.com",
    avatar: '',
    role: "admin",
    token: "token123",
    plan: { name: "pro plan" },
    plan_start_date: new Date().toISOString(),
    plan_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('Profile Component', () => {
    beforeEach(() => {
        renderWithRouter(<Profile user={mockUser} />);
    });



    it('avatar değiştirme kontrolü', async () => {

        const avatarTabButton = screen.getByRole('button', { name: /profil fotoğrafı/i });
        await userEvent.click(avatarTabButton);


        const fileInput = screen.getByTestId('avatar-input');

        const file = new File(['(⌐□_□)'], 'avatar.png', { type: 'image/png' });
        await userEvent.upload(fileInput, file);

        expect(fileInput.files[0]).toBe(file);
        expect(fileInput.files).toHaveLength(1);


    })

});

