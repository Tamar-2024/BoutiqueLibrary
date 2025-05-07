import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminEquipments = () => {
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentCategory, setEquipmentCategory] = useState("");
  const [equipmentDescription, setEquipmentDescription] = useState("");
  const [equipmentImage, setEquipmentImage] = useState("");

  const navigate = useNavigate();

  const handleAddEquipment = async () => {
    try {
      const equipmentData = {
        id: Date.now(),
        name: equipmentName,
        status: "available",
        category: equipmentCategory,
        description: equipmentDescription,
        imgUri: equipmentImage,
      };

      const headers = { 'user': 'admin' };
      await axios.post("http://localhost:3000/admin/equipments", equipmentData, { headers });
      
      navigate("/equipments");
    } catch (error) {
      alert("הייתה בעיה בהוספת הציוד. נסה שוב מאוחר יותר.");
    }
  };

  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: "rgb(185, 145, 103)", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      width: "80%", 
      height: "auto", 
      maxWidth: "800px", 
      margin: "0 auto", 
      borderRadius: "15px" 
    }}>
      <Typography variant="h4" gutterBottom style={{ color: "#4e342e", fontWeight: 'bold' }}>
        הוספת ציוד חדש
      </Typography>
      <TextField
        label="שם הציוד"
        variant="outlined"
        fullWidth
        value={equipmentName}
        onChange={(e) => setEquipmentName(e.target.value)}
        style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "5px" }}
      />
      <TextField
        label="קטגוריה"
        variant="outlined"
        fullWidth
        value={equipmentCategory}
        onChange={(e) => setEquipmentCategory(e.target.value)}
        style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "5px" }}
      />
      <TextField
        label="תיאור הציוד"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={equipmentDescription}
        onChange={(e) => setEquipmentDescription(e.target.value)}
        style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "5px" }}
      />
      <TextField
        label="תמונה של הציוד (URL)"
        variant="outlined"
        fullWidth
        value={equipmentImage}
        onChange={(e) => setEquipmentImage(e.target.value)}
        style={{ marginBottom: "20px", backgroundColor: "#ffffff", borderRadius: "5px" }}
      />
      <Button
        variant="contained"
        onClick={handleAddEquipment}
        style={{
          backgroundColor: "rgb(103, 71, 34)", 
          color: "#fff", 
          padding: "10px 20px", 
          fontSize: "16px", 
          marginTop: "20px",
          borderRadius: "5px", 
          textTransform: "none"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "rgb(80, 51, 19)"}
        onMouseOut={(e) => e.target.style.backgroundColor = "rgb(103, 71, 34)"}
      >
        הוסף ציוד
      </Button>
    </div>
  );
};

export default AdminEquipments;
