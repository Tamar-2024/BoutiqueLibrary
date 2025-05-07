import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardMedia, DialogActions, Typography, Grid, Link } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BorrowBook from './BorrowBook';
import { Link as RouterLink } from 'react-router-dom';

const EquipmentsList = () => {
  const [equipmentsList, setEquipmentsList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [borrowedEquipments, setBorrowedEquipments] = useState([]);
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    axios.get('http://localhost:3000/equipments')
      .then(response => setEquipmentsList(response.data))
      .catch(error => console.error('Error fetching equipments:', error));
  }, []);

  const handleBorrowClick = (equipment) => {
    setSelectedEquipment(equipment);
    setOpenDialog(true);
    setBorrowedEquipments(prev => [...prev, equipment.id]);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEquipment(null);
  };

  return (
    <div style={{ padding: 20, backgroundColor: "rgb(185, 145, 103)", borderRadius: "15px" }}>
      <Typography variant="h4" gutterBottom style={{ color: "#4e342e", textAlign: "center", fontWeight: 'bold' }}>רשימת ציוד</Typography>

      {role === 'admin' && (
        <>
          <AdminLink to="/admin/equipments" label="הוסף ציוד חדש" />
          <AdminLink to="/admin/borrows" label="הצג את כל בקשות ההשאלה" />
        </>
      )}
      {role === 'borrow' && <AdminLink to="/borrows/me" label="הצג את בקשות ההשאלות שלי" />}

      <Grid container spacing={3}>
        {equipmentsList.map(equipment => (
          <Grid item xs={12} sm={6} md={4} key={equipment.id}>
            <EquipmentCard
              equipment={equipment}
              role={role}
              onBorrowClick={handleBorrowClick}
              borrowedEquipments={borrowedEquipments}
            />
          </Grid>
        ))}
      </Grid>

      <BorrowBook
        open={openDialog}
        equipment={selectedEquipment}
        onClose={handleCloseDialog}
        setEquipmentsList={setEquipmentsList}
      />
    </div>
  );
};

const AdminLink = ({ to, label }) => (
  <Link component={RouterLink} to={to} style={{ textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
    <Button
      variant="outlined"
      color="primary"
      style={{
        borderColor: "rgb(108, 70, 29)",
        color: "rgb(108, 70, 29)",
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "8px",
        textTransform: "none"
      }}
      onMouseOver={(e) => e.target.style.borderColor = "rgb(92, 54, 13)"}
      onMouseOut={(e) => e.target.style.borderColor = "rgb(108, 70, 29)"}
    >
      {label}
    </Button>
  </Link>
);

const EquipmentCard = ({ equipment, role, onBorrowClick, borrowedEquipments }) => {
  const isBorrowed = borrowedEquipments.includes(equipment.id);

  return (
    <Card sx={{ maxWidth: 345, borderRadius: "15px", backgroundColor: "rgb(255, 245, 235)" }}>
      {equipment.image && <CardMedia component="img" height="140" image={equipment.image} alt={equipment.name} />}
      <CardContent>
        <Typography variant="h6" style={{ color: "#4e342e" }}>{equipment.name}</Typography>
        {equipment.description && <Typography variant="body2" color="text.secondary">{equipment.description}</Typography>}
        <Typography variant="body2" color="text.secondary">קטגוריה: {equipment.category}</Typography>
        <Typography variant="body2" color="text.secondary">סטטוס: {equipment.status === 'completed' ? 'זמין' : 'מושאל'}</Typography>
      </CardContent>
      {role === 'admin' && <AdminLink to={`/admin/equipments/${equipment.id}`} label="ערוך ציוד" />}
      {role === 'borrow' && (equipment.status === 'available' || equipment.status === 'completed' || equipment.status === 'returned') && 
      !isBorrowed && (
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "rgb(108, 70, 29)",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              textTransform: "none"
            }}
            onClick={() => onBorrowClick(equipment)}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgb(92, 54, 13)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "rgb(108, 70, 29)"}
          >
            השאלה
          </Button>
        </DialogActions>
      )}
    </Card>
  );
};

export default EquipmentsList;
