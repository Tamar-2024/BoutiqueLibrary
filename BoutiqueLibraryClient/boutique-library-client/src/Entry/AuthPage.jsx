import React, { useState } from 'react';
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { Provider } from 'react-redux';
import store from "./Store";
import { Typography, Button, Paper, Box } from '@mui/material';

export default function AuthPage() {
    const [isChoose, setIsChoose] = useState(null);

    return (
        <Provider store={store}>
            <Box sx={backgroundStyle} />
            <Box sx={containerStyle}>
                <Paper elevation={10} sx={paperStyle}>
                    <Typography variant="h4" gutterBottom sx={titleStyle}>
                        Boutique Library
                    </Typography>

                    {isChoose === null && (
                        <>
                            <Button variant="contained" color="secondary" onClick={() => setIsChoose(false)} sx={buttonStyle}>
                                הרשמה
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => setIsChoose(true)} sx={buttonStyle}>
                                כניסה
                            </Button>
                        </>
                    )}
                    {isChoose !== null && (isChoose ? <LoginForm /> : <RegisterForm />)}
                </Paper>
            </Box>
        </Provider>
    );
}

const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(/br.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1
};

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw'
};

const paperStyle = {
    padding: '3%',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 248, 230, 0.85)',
    borderRadius: '12px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(3px)'
};

const titleStyle = {
    color: '#4E342E',
    fontWeight: 'bold',
    fontSize: '5vw'
};

const buttonStyle = {
    fontSize: '2vw',
    fontWeight: 'bold',
    margin: '1vw',
    padding: '1vw 2vw',
    backgroundColor: '#6F4F1F',
    '&:hover': { backgroundColor: '#5e3b1f' },
    '&:active': { backgroundColor: '#4E342E' },
    borderRadius: '8px'
};