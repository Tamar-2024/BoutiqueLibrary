import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminBorrows = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [users, setUsers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const maxReturnDate = new Date();
  maxReturnDate.setDate(maxReturnDate.getDate() + 30);
  const maxReturnDateStr = maxReturnDate.toISOString().split('T')[0];

  useEffect(() => {
    const fetchBorrows = async () => {
      axios.get('http://localhost:3000/admin/borrows', {
        headers: { user: 'admin' }
      })
        .then(response => {
          const responseData = response.data;
          setBorrowRequests(Array.isArray(responseData) ? responseData : [responseData]);
        })
        .catch(error => console.error('Error fetching borrow requests:', error));
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/users', {
          method: 'GET',
          headers: { 'user': 'admin' }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchEquipments = async () => {
      try {
        const response = await fetch('http://localhost:3000/equipments', {
          method: 'GET',
          headers: { 'user': 'admin' }
        });
        if (!response.ok) throw new Error('Failed to fetch equipments');
        const equipmentsData = await response.json();
        setEquipments(equipmentsData);
      } catch (error) {
        console.error('Error fetching equipments:', error);
      }
    };

    fetchUsers();
    fetchBorrows();
    fetchEquipments();
  }, []);

  const updateEquipmentStatus = (equipmentId, status) => {
    axios.put(`http://localhost:3000/admin/equipments/${equipmentId}`, { status }, {
      headers: { 'user': 'admin' }
    })
      .then(() => {
        setEquipments(prevEquipments =>
          prevEquipments.map(eq => eq.id === equipmentId ? { ...eq, status } : eq)
        );
      })
      .catch(error => console.error('Error updating equipment status:', error));
  };

  const handleApprove = (request) => {
    const updatedRequest = { ...request, status: 'borrowed' };

    axios.put(`http://localhost:3000/admin/borrow/${request.id}`, updatedRequest, {
      headers: { 'user': 'admin' }
    })
      .then(() => {
        updateEquipmentStatus(request.equipmentId, 'borrowed');
        setBorrowRequests(prevRequests =>
          prevRequests.map(req => req.id === request.id ? updatedRequest : req)
        );
      })
      .catch(error => console.error('Error updating borrow request:', error));
  };

  const handleReject = (request) => {
    const updatedRequest = { ...request, status: 'rejected' };

    axios.put(`http://localhost:3000/admin/borrow/${request.id}`, updatedRequest, {
      headers: { 'user': 'admin' }
    })
      .then(() => {
        setBorrowRequests(prevRequests =>
          prevRequests.map(req => req.id === request.id ? updatedRequest : req)
        );
      })
      .catch(error => console.error('Error updating borrow request:', error));
  };

  const handleReturn = (request) => {
    const updatedRequest = { ...request, status: 'returned', endDate: endDate };

    axios.put(`http://localhost:3000/admin/borrow/${request.id}`, updatedRequest, {
      headers: { 'user': 'admin' }
    })
      .then(() => {
        updateEquipmentStatus(request.equipmentId, 'returned');
        setBorrowRequests(prevRequests =>
          prevRequests.map(req => req.id === request.id ? updatedRequest : req)
        );
      })
      .catch(error => console.error('Error returning borrow request:', error));
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setStartDate(request.startDate);
    setEndDate(request.endDate);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleExtend = (request) => {
    if (new Date(endDate) <= new Date(startDate)) {
      alert('תאריך החזרה חייב להיות לאחר תאריך ההשאלה');
      return;
    }

    const updatedRequest = { ...request, endDate: endDate };

    axios.put(`http://localhost:3000/admin/borrow/${request.id}`, updatedRequest, {
      headers: { 'user': 'admin' }
    })
      .then(() => {
        setBorrowRequests(prevRequests =>
          prevRequests.map(req => req.id === request.id ? updatedRequest : req)
        );
        setOpenDialog(false);
      })
      .catch(error => console.error('Error updating borrow request:', error));
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>בקשות השאלות</Typography>

      <Link to="/admin/borrows/overdue">
        <Button variant="outlined" color="secondary" style={{ marginBottom: '20px', backgroundColor: '#6F4F37', color: 'white' }}>
          הצג בקשות שפגו זמנן
        </Button>
      </Link>

      <Grid container spacing={3}>
        {borrowRequests.map(request => {
          const equipment = equipments.find(eq => eq.id === request.equipmentId);
          return (
            <Grid item xs={12} sm={6} md={4} key={request.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {equipment ? equipment.name : "שם ציוד לא זמין"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    משתמש: {request.userId ? (users.find(user => user.id === request.userId) ? users.find(user => user.id === request.userId).username : 'לא זמין') : 'לא זמין'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    טלפון: {request.userId ? (users.find(user => user.id === request.userId) ? users.find(user => user.id === request.userId).phone : 'לא זמין') : 'לא זמין'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {request.userId ? (users.find(user => user.id === request.userId) ? users.find(user => user.id === request.userId).email : 'לא זמין') : 'לא זמין'} :אימייל 
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    תאריך בקשה: {new Date(request.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    תאריך החזרה: {new Date(request.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {request.status} :סטטוס 
       
                  </Typography>
                </CardContent>

                <CardContent>
                  <Button variant="contained" color="primary" style={{ backgroundColor: 'rgb(81, 52, 20)', color: 'white', margin: "3px"  }} onClick={() => handleApprove(request)}>
                    אשר בקשה
                  </Button>

                  <Button variant="contained" color="secondary" style={{ backgroundColor: 'rgb(96, 62, 27)', color: 'white', margin: "3px" }} onClick={() => handleReject(request)}>
                    דחה בקשה
                  </Button>
                  <Button variant="contained" color="default" style={{ backgroundColor: 'rgb(129, 93, 54)', color: 'white', margin: "3px" }} onClick={() => handleOpenDialog(request)}>
                    הארך תאריך חזרה
                  </Button>

                  <Button variant="contained" color="success" style={{ backgroundColor: 'rgb(185, 145, 103)', color: 'white', margin: "3px" }} onClick={() => handleReturn(request)}>
                    החזר ספר
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>הארך תאריך חזרה</DialogTitle>
        <DialogContent>
          <TextField
            label="בחר תאריך"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: startDate,
              max: maxReturnDateStr,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            ביטול
          </Button>
          <Button onClick={() => handleExtend(selectedRequest)} color="primary">
            אשר
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminBorrows;