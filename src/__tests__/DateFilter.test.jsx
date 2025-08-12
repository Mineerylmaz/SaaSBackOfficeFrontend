import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateFilter from '../components/DateFilter';
jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve()),
}));

describe('DateFilter component', () => {
    const mockSetStartDate = jest.fn();
    const mockSetEndDate = jest.fn();
    const mockOnFilter = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Başlangıç ve bitiş inputları render edilir', () => {
        render(
            <DateFilter
                startDate=""
                endDate=""
                setStartDate={mockSetStartDate}
                setEndDate={mockSetEndDate}
                onFilter={mockOnFilter}
            />
        );

        expect(screen.getByLabelText(/başlangıç/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/bitiş/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filtrele/i })).toBeInTheDocument();
    });

    it('Başlangıç inputu değişince setStartDate çağrılır', () => {
        render(
            <DateFilter
                startDate=""
                endDate=""
                setStartDate={mockSetStartDate}
                setEndDate={mockSetEndDate}
                onFilter={mockOnFilter}
            />
        );

        const startInput = screen.getByLabelText(/başlangıç/i);
        fireEvent.change(startInput, { target: { value: '2025-07-11T10:00' } });

        expect(mockSetStartDate).toHaveBeenCalledWith('2025-07-11T10:00');
    });

    it('Bitiş inputu değişince setEndDate çağrılır', () => {
        render(
            <DateFilter
                startDate=""
                endDate=""
                setStartDate={mockSetStartDate}
                setEndDate={mockSetEndDate}
                onFilter={mockOnFilter}
            />
        );

        const endInput = screen.getByLabelText(/bitiş/i);
        fireEvent.change(endInput, { target: { value: '2025-07-12T15:00' } });

        expect(mockSetEndDate).toHaveBeenCalledWith('2025-07-12T15:00');
    });

    it('Filtrele butonu onFilter fonksiyonunu çağırır', () => {
        render(
            <DateFilter
                startDate=""
                endDate=""
                setStartDate={mockSetStartDate}
                setEndDate={mockSetEndDate}
                onFilter={mockOnFilter}
            />
        );

        const button = screen.getByRole('button', { name: /filtrele/i });
        fireEvent.click(button);

        expect(mockOnFilter).toHaveBeenCalled();
    });
});
