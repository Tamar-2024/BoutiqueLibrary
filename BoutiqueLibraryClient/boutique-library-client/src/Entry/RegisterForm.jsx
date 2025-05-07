import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserId, setAdminState, setBorrowState } from "./Slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function RegisterForm() {
  const [details, setDetails] = useState({ email: "", username: "", password: "", phone: "", isAdmin: false });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAdmin = details.password === '555';
    try {
      const response = await axios.post("http://localhost:3000/auth/register", { ...details, isAdmin });
      dispatch(setUserId(response.data.userId));
      isAdmin ? dispatch(setAdminState()) : dispatch(setBorrowState());
      navigate("/equipments");
    } catch (error) {
      setError("משתמש זה כבר קיים במערכת");
    }
  };

  return (
    <Box sx={formContainer}>
      <Typography variant="h4" gutterBottom sx={titleStyle}>
        טופס הרשמה
      </Typography>
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField label="שם משתמש" name="username" value={details.username} onChange={handleChange} fullWidth margin="normal" sx={inputStyle} />
        <TextField label="סיסמא" type="password" name="password" value={details.password} onChange={handleChange} fullWidth margin="normal" sx={inputStyle} />
        <TextField label="אימייל" name="email" value={details.email} onChange={handleChange} fullWidth margin="normal" type="email" sx={inputStyle} />
        <TextField label="טלפון" name="phone" value={details.phone} onChange={handleChange} fullWidth margin="normal" sx={inputStyle} />
        <Button type="submit" variant="contained" fullWidth sx={buttonStyle}>
          שלח
        </Button>
      </form>
    </Box>
  );
}

const formContainer = { maxWidth: 400, margin: "auto", padding: 2 };
const titleStyle = { color: '#6F4F1F', fontWeight: 'bold' };
const inputStyle = { color: '#6F4F1F' };
const buttonStyle = { 
  marginTop: 2, 
  backgroundColor: '#6F4F1F',
  '&:hover': { backgroundColor: '#5e3b1f' }
};