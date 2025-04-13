// src/components/Layout/Header.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext"; // Caminho corrigido

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    SIGOC
                </Typography>
                {user && (
                    <Button color="inherit" onClick={logout}>
                        Sair
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;