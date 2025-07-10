import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const DateFilter = ({ startDate, endDate, setStartDate, setEndDate, onFilter }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
                label="Başlangıç Tarihi"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Bitiş Tarihi"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" onClick={onFilter}>
                Filtrele
            </Button>
        </Box>
    );
};

export default DateFilter;
