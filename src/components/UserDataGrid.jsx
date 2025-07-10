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
            const response = await fetch('http://localhost:5000/api/adminpanel/list-users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            Swal.fire('Error', 'Failed to fetch users', 'error');
        }
    };
    const [loadingPlanUpdate, setLoadingPlanUpdate] = useState(false);

    const updateUserPlan = async (userId, newPlan) => {
        try {
            const response = await fetch(`http://localhost:5000/api/adminpanel/update-user-plan/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: newPlan }),
            });
            if (!response.ok) throw new Error('Plan güncellenemedi');
            Swal.fire('Başarılı', 'Plan güncellendi', 'success');
            fetchUsers();
        } catch (error) {
            Swal.fire('Hata', error.message, 'error');
        }
    };



    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            Swal.fire('No Selection', 'Please select at least one user.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: `${selectedIds.length} users will be deleted!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(
                        selectedIds.map(async (id) => {
                            const response = await fetch(`http://localhost:5000/api/adminpanel/delete-user/${id}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' }
                            });
                            if (!response.ok) {
                                throw new Error(`Failed to delete user ${id}: ${await response.text()}`);
                            }
                        })
                    );
                    Swal.fire('Success', 'Selected users have been deleted.', 'success');
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
            const response = await fetch('http://localhost:5000/api/adminpanel/deleted-users');
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
    ];

    return (
        <div className='userdatagrid'>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteSelected}

                >
                    Delete Selected
                </Button>

                <Button
                    variant="outlined"
                    onClick={fetchDeletedUsers}
                    disabled={showDeleted}
                >
                    Show Deleted Users
                </Button>

                {showDeleted && (
                    <Button
                        variant="text"
                        onClick={() => {
                            setShowDeleted(false);
                            fetchUsers();
                        }}
                    >
                        Hide Deleted Users
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
                />

            </Box>
        </div>
    );
}
