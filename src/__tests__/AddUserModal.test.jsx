import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddUserModal from '../components/AddUserModal';

describe('AddUserModal component', () => {
    const defaultProps = {
        visible: true,
        onClose: jest.fn(),
        email: '',
        setEmail: jest.fn(),
        password: '',
        setPassword: jest.fn(),
        credits: 0,
        setCredits: jest.fn(),
        role: 'user',
        setRole: jest.fn(),
        handleAddUser: jest.fn((e) => e.preventDefault()),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Modal görünmezken render edilmez', () => {
        render(<AddUserModal {...defaultProps} visible={false} />);
        expect(screen.queryByText('Kullanıcı Ekle')).not.toBeInTheDocument();
    });

    test('Modal görünürken inputlar ve butonlar render edilir', () => {
        render(<AddUserModal {...defaultProps} />);
        expect(screen.getByText('Kullanıcı Ekle')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('E-posta')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Şifre')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Kredi')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Ekle' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'İptal' })).toBeInTheDocument();
    });

    test('Input değişiklikleri doğru callbackleri çağırır', () => {
        render(<AddUserModal {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText('E-posta'), { target: { value: 'test@example.com' } });
        expect(defaultProps.setEmail).toHaveBeenCalledWith('test@example.com');

        fireEvent.change(screen.getByPlaceholderText('Şifre'), { target: { value: '123456' } });
        expect(defaultProps.setPassword).toHaveBeenCalledWith('123456');

        fireEvent.change(screen.getByPlaceholderText('Kredi'), { target: { value: '50' } });
        expect(defaultProps.setCredits).toHaveBeenCalledWith(50);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'admin' } });
        expect(defaultProps.setRole).toHaveBeenCalledWith('admin');
    });

    test('Form submit olunca handleAddUser çağrılır', () => {
        render(<AddUserModal {...defaultProps} />);
        fireEvent.submit(screen.getByLabelText('add-user-form'));

        expect(defaultProps.handleAddUser).toHaveBeenCalled();
    });

    test('İptal butonu onClose fonksiyonunu çağırır', () => {
        render(<AddUserModal {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'İptal' }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});
