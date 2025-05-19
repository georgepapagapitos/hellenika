import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        maxWidth: 400,
        width: "100%",
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Welcome Back
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        Sign in to continue learning Greek
      </Typography>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          autoComplete="email"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          autoComplete="current-password"
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Button
              color="primary"
              onClick={onRegisterClick}
              sx={{ textTransform: "none" }}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
};

export default LoginForm;
