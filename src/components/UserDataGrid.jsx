import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}.${minutes} ${day}.${month}.${year}`;
}

export default function UserDataGrid() {
    const [users, setUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        fetchUsers();

        const planJson = localStorage.getItem('selectedPlan');
        if (planJson) {
            try {
                setSelectedPlan(JSON.parse(planJson));
            } catch {
                setSelectedPlan(null);
            }
        }
    }, []);





    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:32807/api/adminpanel/list-users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to fetch users', 'error');
        }
    };
    const [loadingPlanUpdate, setLoadingPlanUpdate] = useState(false);




    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            Swal.fire('No Selection', 'Please select at least one user.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Emin Misiniz?',
            text: `${selectedIds.length} kullanıcıyı silmek istediğinize emin misiniz?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'Hayır, İptal Et',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            const response = await fetch(`http://localhost:32807/api/adminpanel/delete-user/${id}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' }
                            });
                            if (!response.ok) {
                                throw new Error(`Failed to delete user ${id}: ${await response.text()}`);
                            }
                        })
                    );
                    Swal.fire('Başarılı', 'Seçili kullanıcılar silindi', 'success');
                    fetchUsers();
                    setSelectedIds([]);
                } catch (error) {
                    console.error('Delete error:', error);
                    Swal.fire('Error', error.message || 'Failed to delete users', 'error');
                }
            }
        });
    };

    const fetchDeletedUsers = async () => {
        try {
            const response = await fetch('http://localhost:32807/api/adminpanel/deleted-users');
            const data = await response.json();
            setDeletedUsers(data);
            setShowDeleted(true);
        } catch (error) {
            console.error('Error fetching deleted users:', error);
            Swal.fire('Error', 'Failed to fetch deleted users', 'error');
        }
    };




    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: 'plan',
            headerName: 'Plan',
            width: 130,

        },

        {
            field: 'last_login',
            headerName: 'Son Giriş',
            width: 160,
            renderCell: (params) => (params.value ? formatDate(params.value) : '-'),
        },
        {
            field: 'created_at',
            headerName: 'Oluşturulma Tarihi',
            width: 160,
            renderCell: (params) => (params.value ? formatDate(params.value) : '-'),
        },
        {
            field: 'remainingCredits',
            headerName: 'Kalan Kredi',
            width: 130,
            renderCell: (params) => params.value

        }
        ,
    ];

    return (
        <div className='userdatagrid'>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteSelected}
                    disabled={showDeleted}

                >
                    Seçilenleri Sil
                </Button>

                <Button
                    variant="outlined"
                    onClick={fetchDeletedUsers}
                    disabled={showDeleted}
                >
                    Silinen Kullanıcıları Göster
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedIds.length !== 1}
                    onClick={async () => {
                        const selectedUser = users.find((u) => u.id === selectedIds[0]);
                        if (!selectedUser) return;

                        const token = localStorage.getItem("token");
                        if (!token) {
                            return Swal.fire('Hata', 'Oturum süresi dolmuş, tekrar giriş yapın.', 'error');
                        }

                        try {
                            const res = await fetch(`http://localhost:32807/api/userSettings/settings/${selectedUser.id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                },
                            });

                            if (!res.ok) throw new Error("Plan bilgisi alınamadı");

                            const data = await res.json();

                            const enrichedUser = {
                                ...selectedUser,
                                plan: data.plan || null,
                                settings: data.settings || {},
                            };

                            localStorage.setItem("selectedUser", JSON.stringify(enrichedUser));

                            Swal.fire({
                                icon: "success",
                                title: "Kullanıcı Seçildi",
                                text: `${selectedUser.email} ayarlarını görmek için ayarlara geçin.`,
                                confirmButtonText: 'Ayarlara Git',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '/ayarlar';
                                }
                            });

                        } catch (err) {
                            console.error("Plan bilgisi alınamadı:", err);
                            Swal.fire({
                                icon: "error",
                                title: "Hata",
                                text: "Plan bilgisi alınamadı",
                            });
                        }
                    }}



                >
                    Kullanıcı Ayarlarına Git
                </Button>


                {showDeleted && (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setShowDeleted(false);
                            fetchUsers();
                        }}
                    >
                        Silinmiş kullanıcıları gizle
                    </Button>
                )}
            </Box>

            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={showDeleted ? deletedUsers : users}
                    columns={columns}
                    checkboxSelection
                    getRowId={(row) => row.id}
                    selectionModel={selectedIds}
                    onRowSelectionModelChange={(selectionModel) => {
                        if (selectionModel?.ids) {
                            const idsSet = selectionModel.ids;
                            const idsArray = Array.from(idsSet);
                            console.log('Selected IDs:', idsArray);
                            setSelectedIds(idsArray);
                        } else if (Array.isArray(selectionModel)) {
                            setSelectedIds(selectionModel);
                        } else {
                            setSelectedIds([]);
                        }
                    }}
                    onRowClick={(params) => {
                        const clickedUser = users.find((u) => u.id === params.row.id);
                        if (clickedUser) {
                            localStorage.setItem('selectedUser', JSON.stringify(clickedUser));
                            Swal.fire({
                                icon: 'success',
                                title: 'Kullanıcı Seçildi',
                                text: `${clickedUser.email} ayarlarını görmek için ayarlara geçin.`,
                                showCancelButton: true,
                                confirmButtonText: 'Ayarlara Git',
                                cancelButtonText: 'Kapat',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '/ayarlar';
                                }
                            });
                        }
                    }}

                />

            </Box>
        </div>
    );
}
