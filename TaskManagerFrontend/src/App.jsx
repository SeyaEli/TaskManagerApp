import { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  TextField,
  Container,
  Stack,
  useColorScheme,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Logout,
  Add,
  Dashboard,
} from "@mui/icons-material";
import API from "./api/api";
import Board from "./components/Board";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [users, setUsers] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBoards();
      fetchUsers();
    }
  }, [user]);

  const fetchBoards = async () => {
    const res = await API.get("/boards");
    setBoards(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get("/auth/users");
    setUsers(res.data);
  };

  const addBoard = async () => {
    if (!newBoardName.trim()) return;
    await API.post("/boards", { name: newBoardName });
    setNewBoardName("");
    fetchBoards();
  };

  const deleteBoard = async (id) => {
    if (confirm("Delete this board?")) {
      await API.delete(`/boards/${id}`);
      fetchBoards();
    }
  };

  const updateBoard = async (id, data) => {
    await API.put(`/boards/${id}`, data);
    fetchBoards();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setBoards([]);
  };

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Dashboard sx={{ mr: 2, color: "primary.light" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Task Manager
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "secondary.main",
                  fontSize: "0.875rem",
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
                {user.username}
              </Typography>
            </Stack>

            <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === "light" ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton onClick={logout} color="inherit">
                <Logout />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: "12px",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Create New Board
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              placeholder="Enter board name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addBoard()}
              fullWidth
              size="medium"
            />
            <Button
              variant="contained"
              onClick={addBoard}
              startIcon={<Add />}
              sx={{
                px: 4,
                textTransform: "none",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Add Board
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {boards.map((board) => (
            <Board
              key={board.id}
              board={board}
              onDelete={deleteBoard}
              onUpdate={updateBoard}
              users={users}
            />
          ))}
        </Box>

        {boards.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Dashboard sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No boards yet
            </Typography>
            <Typography variant="body2">
              Create your first board to get started with task management
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
