import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserId, setAdminState, setBorrowState } from "./Slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";

export default function LoginForm() {
  const [loginDetail, setLoginDetail] = useState({ username: "", password: "" });
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginDetail({ ...loginDetail, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", loginDetail);
      const { userId } = response.data;
      dispatch(setUserId(userId));
      loginDetail.password === '555' ? dispatch(setAdminState()) : dispatch(setBorrowState());
      setIsLogin(true);
    } catch (error) {
      setError("שם משתמש או סיסמא לא נכונים");
    }
  };

  useEffect(() => {
    if (isLogin) navigate("/equipments");
  }, [isLogin, navigate]);

  return (
    <Box sx={formContainer}>
      <Typography variant="h4" gutterBottom sx={titleStyle}>
        טופס התחברות
      </Typography>
      {error && <Typography color="error" variant="body2">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField label="שם משתמש" name="username" value={loginDetail.username} onChange={handleChange} fullWidth margin="normal" sx={inputStyle} />
        <TextField label="סיסמא" type="password" name="password" value={loginDetail.password} onChange={handleChange} fullWidth margin="normal" sx={inputStyle} />
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