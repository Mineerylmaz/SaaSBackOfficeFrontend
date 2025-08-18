


import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';


import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from '@mui/material';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';


import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { color } from '@chakra-ui/react';

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
    const [quickFilter, setQuickFilter] = useState('');
    const [newIsRepeatable, setNewIsRepeatable] = useState(false);


    useEffect(() => {
        fetchKeys();
    }, []);
    const filteredRows = useMemo(() => {
        if (!quickFilter) return keys;
        const q = quickFilter.toLowerCase();
        return keys.filter(r =>
            (r.key_name || '').toLowerCase().includes(q) ||
            (r.type || '').toLowerCase().includes(q) ||
            (r.description || '').toLowerCase().includes(q)
        );
    }, [keys, quickFilter]);


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
                    required: newRequired,
                    is_repeatable: newIsRepeatable
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
        { field: 'key_name', headerName: 'Key', flex: 1, minWidth: 150, editable: true },
        { field: 'type', headerName: 'Tip', flex: 1, minWidth: 100, editable: true },
        { field: 'is_repeatable', headerName: 'Tekrarlanabilir mi?', width: 150, renderCell: (params) => params.value ? 'Evet' : 'Hayır' },


        {
            field: 'description',
            headerName: 'Açıklama',
            flex: 1,
            minWidth: 200,
            editable: true,
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
    const handleRowUpdate = async (updatedRow, oldRow) => {
        try {
            const res = await fetch(`${API_URL}/${updatedRow.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRow),
            });

            if (!res.ok) {
                throw new Error('Güncelleme başarısız');
            }

            const data = await res.json();
            Swal.fire('Başarılı', 'Veri güncellendi', 'success');
            return data;
        } catch (err) {
            console.error(err);
            Swal.fire('Hata', 'Güncelleme sırasında bir sorun oluştu', 'error');
            return oldRow;
        }
    };


    return (
        <Box sx={{ p: 2 }}>
            {/* Header / Action bar */}
            <Box
                sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(20,28,38,.6)' : 'rgba(255,255,255,.7)'),
                    backdropFilter: 'blur(8px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        Admin — Key & Tip Yönetimi
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sistem üzerinde kullanılacak key’leri ekleyin, güncelleyin veya kaldırın.
                    </Typography>
                </Box>

                {/* + Key (FAB) */}
                <Button
                    variant="contained"
                    onClick={() => setShowModal(true)}
                    startIcon={<span style={{ fontSize: 18, lineHeight: 1 }}>＋</span>}
                    sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        fontWeight: 800,
                        boxShadow: 2,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #00AEEF, #0055A4)',
                        '&:hover': { filter: 'brightness(1.05)' },
                    }}
                >
                    Yeni Key
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Card
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: (t) => (t.palette.mode === 'dark' ? '0 10px 30px rgba(0,0,0,.35)' : '0 10px 30px rgba(0,0,0,.08)'),
                    }}
                >
                    {/* DataGrid */}
                    <Box sx={{ height: 520, width: '100%' }}>
                        <DataGrid rows={filteredRows}

                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            disableSelectionOnClick
                            getRowId={(row) => row.id}
                            processRowUpdate={handleRowUpdate}
                            experimentalFeatures={{ newEditingApi: true }}
                            localeText={{ noRowsLabel: 'Tanımlı key yok.' }}
                            /* Yukarı araç çubuğu */
                            slots={{
                                toolbar: () => (
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,.02)' : 'rgba(0,0,0,.02)'),
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 700, mr: 1 }}>Key Listesi</Typography>
                                        <Box sx={{ flex: 1 }} />
                                        {/* Hızlı arama */}
                                        <TextField
                                            size="small"
                                            placeholder="Ara (key adı, tip...)"
                                            onChange={(e) => setQuickFilter(e.target.value)} // İstersen burada kendi state’ini kullan
                                            sx={{ width: 260 }}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={fetchKeys} // sende varsa — yoksa kaldır
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Yenile
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => setShowModal(true)}
                                            sx={{ textTransform: 'none', ml: 1 }}
                                        >
                                            + Key
                                        </Button>
                                    </Box>
                                ),
                            }}
                            /* Satır stili */
                            sx={{
                                '--rowStripe': (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,.03)' : 'rgba(2,6,23,.03)'),
                                '& .MuiDataGrid-row:nth-of-type(2n)': { backgroundColor: 'var(--rowStripe)' },
                                '& .MuiDataGrid-cell': { borderColor: 'divider' },
                                '& .MuiDataGrid-columnHeaders': {
                                    bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,.04)' : 'rgba(2,6,23,.04)'),
                                    borderColor: 'divider',
                                    fontWeight: 800,
                                },
                                '& .MuiDataGrid-footerContainer': { borderTop: '1px solid', borderColor: 'divider' },
                            }}
                        />
                    </Box>
                </Card>
            )}

            {/* Modal */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        addKey();
                    }}
                    sx={{
                        ...modalStyle,
                        borderRadius: 3,
                        p: 0,
                        overflow: 'hidden',
                        boxShadow: 24,
                        minWidth: { xs: '92vw', sm: 560 },
                    }}
                >
                    {/* Modal Header */}
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            bgcolor: 'rgba(0, 174, 239, .12)',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Typography id="modal-title" sx={{ fontWeight: 800 }}>
                            Yeni Key Ekle
                        </Typography>
                        <Button onClick={() => setShowModal(false)} variant="text">Kapat</Button>
                    </Box>

                    {/* Modal Body */}
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    label="Key adı"
                                    value={newKey}
                                    onChange={(e) => setNewKey(e.target.value)}
                                    fullWidth
                                    required
                                    helperText="örn: api_base_url, max_retry_count"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth required>
                                    <InputLabel id="type-label">Tip</InputLabel>
                                    <Select
                                        labelId="type-label"
                                        value={newType}
                                        label="Tip"
                                        onChange={(e) => setNewType(e.target.value)}
                                    >
                                        <MenuItem value="number">Number</MenuItem>
                                        <MenuItem value="string">String</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Açıklama"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    placeholder="Bu key nerede/niçin kullanılıyor?"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={newRequired}
                                            onChange={(e) => setNewRequired(e.target.checked)}
                                        />
                                    }
                                    label="Zorunlu"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={newIsRepeatable}
                                            onChange={(e) => setNewIsRepeatable(e.target.checked)}
                                        />
                                    }
                                    label="Tekrarlanabilir"
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                            <Button onClick={() => setShowModal(false)} variant="outlined">
                                İptal
                            </Button>
                            <Button type="submit" variant="contained">
                                Ekle
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );

};

export default SettingTab;
