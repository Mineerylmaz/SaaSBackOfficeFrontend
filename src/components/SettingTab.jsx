import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Checkbox, FormControlLabel } from '@mui/material';

import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://localhost:32807/api/setting-key';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 320,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
};

const SettingTab = () => {
    const [keys, setKeys] = useState([]);
    const [newKey, setNewKey] = useState('');
    const [newType, setNewType] = useState('number');
    const [newDescription, setNewDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newRequired, setNewRequired] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Liste alınamadı');
            const data = await res.json();
            setKeys(data);
        } catch (error) {
            console.error('Keyler çekilirken hata:', error);
            alert('Keyler çekilirken hata oluştu');
        }
        setLoading(false);
    };

    const addKey = async () => {
        const trimmedKey = newKey.trim();

        if (!trimmedKey) {
            return alert('Key boş olamaz!');
        }

        if (keys.some(k => k.key_name === trimmedKey)) {
            return Swal.fire({
                title: 'Bu key zaten var!',
                text: 'Lütfen farklı bir key adı girin.',
                icon: 'warning',
                confirmButtonText: 'Tamam',
            });
        }

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key_name: trimmedKey,
                    type: newType,
                    description: newDescription.trim(),
                    required: newRequired
                }),

            });

            const result = await res.json();
            if (!res.ok) {
                alert(result.error || 'Key eklenemedi!');
                return;
            }

            Swal.fire('Başarılı!', 'Key başarıyla eklendi.', 'success');
            setNewKey('');
            setNewType('number');
            setNewDescription('');
            setShowModal(false);
            fetchKeys();
        } catch (error) {
            console.error('Key eklenirken hata:', error);
            alert('Key eklenirken sunucu hatası oluştu.');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Silmek istediğinize emin misiniz?',
            text: 'Bu işlem geri alınamaz!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal',
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                if (!res.ok) throw new Error('Silme başarısız');
                await fetchKeys();
                Swal.fire('Silindi!', 'Key başarıyla silindi.', 'success');
            } catch (err) {
                console.error('Silme hatası:', err);
                Swal.fire('Hata!', 'Silme işlemi başarısız oldu.', 'error');
            }
        }
    };

    const columns = [
        { field: 'required', headerName: 'Zorunlu mu?', width: 120, renderCell: (params) => params.value ? 'Evet' : 'Hayır' },

        { field: 'key_name', headerName: 'Key', flex: 1, minWidth: 150 },
        { field: 'type', headerName: 'Tip', flex: 1, minWidth: 100 },
        {
            field: 'description',
            headerName: 'Açıklama',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => params.value || '-',
        },
        {
            field: 'actions',
            headerName: 'İşlem',
            type: 'actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon color="error" />}
                    label="Sil"
                    onClick={() => handleDelete(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{ p: 2, fontFamily: 'Arial, sans-serif' }}>
            <Typography variant="h5" mb={2}>
                Admin - Key ve Tip Ekle
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setShowModal(true)}
                sx={{ mb: 2, minWidth: 40, minHeight: 40, borderRadius: '50%', fontSize: 24, fontWeight: 'bold' }}
                title="Yeni Key Ekle"
            >
                +
            </Button>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ height: 450, width: '100%' }}>
                    <DataGrid
                        rows={keys}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        disableSelectionOnClick
                        getRowId={(row) => row.id}
                        localeText={{
                            noRowsLabel: 'Tanımlı key yok.',
                        }}
                    />
                </Box>
            )}

            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle} component="form" onSubmit={e => { e.preventDefault(); addKey(); }}>
                    <Typography id="modal-title" variant="h6" mb={2}>
                        Yeni Key Ekle
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newRequired}
                                onChange={(e) => setNewRequired(e.target.checked)}
                            />
                        }
                        label="Zorunlu (required)"
                        sx={{ mt: 1 }}
                    />


                    <TextField
                        label="Key adı"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="type-label">Tip</InputLabel>
                        <Select
                            labelId="type-label"
                            value={newType}
                            label="Tip"
                            onChange={(e) => setNewType(e.target.value)}
                            required
                        >
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="string">String</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Açıklama (description)"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                        <Button onClick={() => setShowModal(false)} variant="outlined">
                            İptal
                        </Button>
                        <Button type="submit" variant="contained">
                            Ekle
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default SettingTab;
