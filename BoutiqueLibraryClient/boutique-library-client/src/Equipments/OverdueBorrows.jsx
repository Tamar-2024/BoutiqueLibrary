import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

function OverdueBorrows() {
  const [overdueBorrows, setOverdueBorrows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/admin/borrows/overdue', {
      method: 'GET',
      headers: {
        'user': 'admin',  
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {
        setOverdueBorrows(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Overdue Requests
      </Typography>
      {overdueBorrows.length === 0 ? (
        <Typography>No overdue borrow requests.</Typography>
      ) : (
        <Paper>
          <List>
            {overdueBorrows.map((borrow) => (
              <ListItem key={borrow.equipmentId}>
                <ListItemText
                  primary={`Equipment ID: ${borrow.equipmentId}`}
                  secondary={`User ID: ${borrow.userId} | Due Date: ${borrow.endDate}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default OverdueBorrows;