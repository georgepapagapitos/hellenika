import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate("/"); // Redirect to home page after successful auth
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {isLogin ? (
          <LoginForm
            onSuccess={handleSuccess}
            onRegisterClick={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onLoginClick={() => setIsLogin(true)}
          />
        )}
      </Box>
    </Container>
  );
};

export default AuthPage;
