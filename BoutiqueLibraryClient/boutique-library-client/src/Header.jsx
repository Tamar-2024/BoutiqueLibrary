// src/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{marginBottom: '5%',  backgroundColor: 'rgb(50, 30, 8)' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          Boutique Library
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
