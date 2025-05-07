import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography, Box } from '@mui/material';
import { useSelector } from "react-redux";

const BorrowBook = ({ open, equipment, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  
  const userId = useSelector(state => state.user.userId);

  if (!equipment) return null;

  const today = new Date().toISOString().split('T')[0];
  const maxReturnDateStr = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];

  const validateDates = () => {
    if (!startDate || !endDate) return '.יש לבחור תאריך השאלה ותאריך החזרה';
    if (startDate < today) return '.תאריך ההשאלה לא יכול להיות לפני היום';
    if (endDate < startDate) return '.תאריך החזרה לא יכול להיות לפני תאריך ההשאלה';
    if (endDate > maxReturnDateStr) return '.תאריך ההחזרה לא יכול להיות מאוחר יותר מחודש מהיום';
    return '';
  };

  const handleSubmitBorrow = async () => {
    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/borrow',
        { equipmentId: equipment.id, startDate, endDate },
        { headers: { user: userId } }
      );
      onClose();
    } catch {
      setError('.הייתה בעיה בשליחת הבקשה. נסה שוב');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ backgroundColor: "rgb(185, 145, 103)", fontWeight: 'bold', color: "rgb(75, 46, 13)", fontSize: "25px"}}>
        השאלת ציוד
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "rgb(240, 220, 200)"}}>
        <Typography variant="body1" gutterBottom style={{ color: "#4e342e", textAlign: "center",padding: "25px", fontWeight: 'bold' }}>
          האם אתה בטוח שברצונך להשאיל את? {equipment.name}
        </Typography>

        {error && <Typography color="error" variant="body2" gutterBottom style={{ textAlign: "center" }}>{error}</Typography>}

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body2" style={{ color: "#4e342e", fontWeight: 'bold' }}>:תאריך השאלה</Typography>
          <TextField
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            inputProps={{ min: today, max: maxReturnDateStr }}
            style={{ marginBottom: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body2" style={{ color: "#4e342e", fontWeight: 'bold' }}>:תאריך החזרה</Typography>
          <TextField
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            inputProps={{ min: startDate || today, max: maxReturnDateStr }}
            style={{ marginBottom: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Button
            variant="contained"
            onClick={handleSubmitBorrow}
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
            אשר השאלה
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            style={{
              borderColor: "rgb(108, 70, 29)",
              color: "rgb(108, 70, 29)",
              padding: "10px 20px",
              fontSize: "16px",
              marginTop: "20px",
              borderRadius: "8px",
              textTransform: "none"
            }}
            onMouseOver={(e) => e.target.style.borderColor = "rgb(92, 54, 13)"}
            onMouseOut={(e) => e.target.style.borderColor = "rgb(108, 70, 29)"}
          >
            ביטול
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowBook;
