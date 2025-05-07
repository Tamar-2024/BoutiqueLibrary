import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Typography, Container, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';



const BookEditing = () => {
  const [editingBook, setEditingBook] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/equipment/${id}`);
        setEditingBook(response.data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleUpdateBook = async () => {
    if (id && editingBook) {
      try {
        await axios.put(`http://localhost:3000/admin/equipments/${id}`, editingBook, {
          headers: { 'user': 'admin' }
        });
        navigate(-1);
      } catch (error) {
        console.error("Error updating equipment:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBook(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ color: "#4e342e", textAlign: "center", fontWeight: 'bold'}}>
        פאנל ניהול ציוד
      </Typography>
      <Card sx={{ marginBottom: 3, borderRadius: "15px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "rgb(185, 145, 103)"
      }}>
        <CardContent>
          <Typography variant="h5" gutterBottom style={{ color: "#4e342e", textAlign: "center", fontWeight: 'bold' }}>
            ערוך ציוד
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="שם הציוד"
                variant="outlined"
                fullWidth
                name="name"
                value={editingBook ? editingBook.name : ''}
                onChange={handleInputChange}
                required
                style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="קטגוריה"
                variant="outlined"
                fullWidth
                name="category"
                value={editingBook ? editingBook.category : ''}
                onChange={handleInputChange}
                required
                style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="סטטוס"
                variant="outlined"
                fullWidth
                name="status"
                value={editingBook ? editingBook.status : ''}
                onChange={handleInputChange}
                required
                style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="תיאור"
                variant="outlined"
                fullWidth
                name="description"
                value={editingBook ? editingBook.description : ''}
                onChange={handleInputChange}
                style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "8px" }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleUpdateBook}
            style={{
              backgroundColor: "rgb(108, 70, 29)",
              color: "#fff",
              padding: "10px 20px",
              fontSize: "16px",
              marginTop: "20px",
              borderRadius: "8px",
              textTransform: "none"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "rgb(92, 54, 13)"}
            onMouseOut={(e) => e.target.style.backgroundColor = "rgb(108, 70, 29)"}
          >
            עדכן ציוד
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BookEditing;
