import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  Container,
} from "@mui/material";
import { Login as LoginIcon, PersonAdd } from "@mui/icons-material";
import API from "../api/api";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const data = isRegister ? { username, email, password } : { username, password };
      const res = await API.post(endpoint, data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      onLogin(res.data.user);
    } catch (err) {
      console.error("Auth error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Authentication failed";
      setError(errorMsg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-secondary-main) 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={4}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-secondary-main) 100%)",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 1 }}>
              Task Manager
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {isRegister ? "Create your account" : "Welcome back!"}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  fullWidth
                  autoFocus
                />
                {isRegister && (
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                )}
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={isRegister ? <PersonAdd /> : <LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {isRegister ? "Create Account" : "Sign In"}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
              </Typography>
              <Button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                sx={{ mt: 1, textTransform: "none" }}
              >
                {isRegister ? "Sign In" : "Create Account"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
