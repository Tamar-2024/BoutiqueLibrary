import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Container, Typography, Card, CardContent, Button, Grid, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL');
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a4f32', 
    },
    secondary: {
      main: '#d2b19d', 
    },
    text: {
      primary: '#5d4037', 
      secondary: '#8d6e63'
    },
  },
});

const UserBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const userId = useSelector((state) => state.user?.userId);

  useEffect(() => {
    const fetchBorrows = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/borrows/me', {
          method: 'GET',
          headers: {
            'user': userId,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch borrows');
        }

        const data = await response.json();
        setBorrows(data);
      } catch (error) {
        console.error('Error fetching borrows:', error);
      }
    };

    const fetchEquipments = async () => {
      try {
        const response = await fetch('http://localhost:3000/equipments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch equipments');
        }

        const data = await response.json();
        setEquipments(data);
      } catch (error) {
        console.error('Error fetching equipments:', error);
      }
    };

    if (userId) {
      fetchBorrows();
    }

    fetchEquipments();

  }, [userId]);

  const handleReturn = async (borrowId) => {
    try {
      const response = await fetch(`http://localhost:3000/borrow/${borrowId}/return`, {
        method: 'PUT',
        headers: {
          'user': userId,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to return equipment');
      }

      setBorrows(borrows.map(borrow =>
        borrow.id === borrowId ? { ...borrow, status: 'הוחזר' } : borrow
      ));
    } catch (error) {
      console.error('Error returning equipment:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4" gutterBottom align="center" color="primary" fontWeight="bold">
          בקשות השאלות שלי
        </Typography>
        <Grid container spacing={3}>
          {borrows.map(borrow => {
            const equipment = equipments.find(eq => eq.id === borrow.equipmentId);
            return (
              <Grid item xs={12} sm={6} md={4} key={borrow.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#f1e0d6' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {equipment ? equipment.name : "שם ציוד לא זמין"}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      תאריך השאלה: {formatDate(borrow.startDate)}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      תאריך החזרה: {formatDate(borrow.endDate)}
                    </Typography>
                    <Typography variant="body2" color={borrow.status === 'borrowed' ? 'error' : 'green'}>
                     סטטוס: {borrow.status}
                    </Typography>

                    {borrow.status === 'borrowed' && (
                      <Box mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleReturn(borrow.id)}
                        >
                          החזר ספר
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default UserBorrows;
