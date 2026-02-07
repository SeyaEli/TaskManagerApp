import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  CheckCircle,
  RadioButtonUnchecked,
  Close,
  Save,
  Search,
  PriorityHigh,
  Flag,
  CalendarToday,
  Person,
} from "@mui/icons-material";
import API from "../api/api";
import { HubConnectionBuilder } from "@microsoft/signalr";
import TaskModal from "./TaskModal";

export default function Board({ board, onDelete, onUpdate, users }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  const [boardColor, setBoardColor] = useState(board.color || "#6366f1");

  useEffect(() => {
    fetchTasks();

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5275/taskhub")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveTaskUpdate", () => {
      fetchTasks();
    });

    connection.start();

    return () => connection.stop();
  }, [board.id]);

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${board.id}`);
    setTasks(res.data);
  };

  const addTask = () => {
    setEditingTask({ boardId: board.id });
    setShowModal(true);
  };

  const editTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const saveTask = async (task) => {
    try {
      if (task.id) {
        await API.put(`/tasks/${task.id}`, task);
      } else {
        await API.post("/tasks", task);
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Save task error:", err);
      alert(err.response?.data?.title || err.response?.data || err.message || "Failed to save task");
    }
  };

  const deleteTask = async (id) => {
    if (confirm("Delete this task?")) {
      await API.delete(`/tasks/${id}`);
    }
  };

  const completeTask = async (id) => {
    await API.put(`/tasks/${id}/complete`);
  };

  const saveBoard = async () => {
    await onUpdate(board.id, { name: boardName, color: boardColor });
    setEditingBoard(false);
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.isCompleted;
      if (filter === "incomplete") return !t.isCompleted;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const getPriorityColor = (priority) => {
    if (priority === "High") return "error";
    if (priority === "Low") return "success";
    return "warning";
  };

  const getPriorityIcon = (priority) => {
    if (priority === "High") return <PriorityHigh fontSize="small" />;
    if (priority === "Low") return <Flag fontSize="small" />;
    return <Flag fontSize="small" />;
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "fit-content",
        borderRadius: "12px",
        border: 1,
        borderColor: "divider",
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardHeader
        sx={{
          bgcolor: boardColor,
          color: "white",
          "& .MuiCardHeader-title": {
            fontWeight: 600,
          },
        }}
        title={
          editingBoard ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                size="small"
                variant="outlined"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                }}
              />
              <input
                type="color"
                value={boardColor}
                onChange={(e) => setBoardColor(e.target.value)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid white",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              />
            </Stack>
          ) : (
            board.name
          )
        }
        action={
          editingBoard ? (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Save">
                <IconButton onClick={saveBoard} size="small" sx={{ color: "white" }}>
                  <Save />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton onClick={() => setEditingBoard(false)} size="small" sx={{ color: "white" }}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit Board">
                <IconButton onClick={() => setEditingBoard(true)} size="small" sx={{ color: "white" }}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Board">
                <IconButton onClick={() => onDelete(board.id)} size="small" sx={{ color: "white" }}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <TextField
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Filter">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="incomplete">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Button
            variant="contained"
            onClick={addTask}
            startIcon={<Add />}
            fullWidth
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Add Task
          </Button>

          <Divider />

          <Stack spacing={1.5}>
            {filteredTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                <Typography variant="body2">No tasks found</Typography>
              </Box>
            ) : (
              filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderLeft: 4,
                    borderLeftColor: `${getPriorityColor(task.priority)}.main`,
                    opacity: task.isCompleted ? 0.7 : 1,
                    "&:hover": {
                      boxShadow: 2,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          !task.isCompleted && completeTask(task.id);
                        }}
                        sx={{ mt: -0.5 }}
                      >
                        {task.isCompleted ? (
                          <CheckCircle color="success" />
                        ) : (
                          <RadioButtonUnchecked color="action" />
                        )}
                      </IconButton>

                      <Box sx={{ flex: 1 }} onClick={() => editTask(task)}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            textDecoration: task.isCompleted ? "line-through" : "none",
                          }}
                        >
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, fontSize: "0.875rem" }}
                          >
                            {task.description}
                          </Typography>
                        )}

                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
                          <Chip
                            icon={getPriorityIcon(task.priority)}
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority)}
                            variant="outlined"
                          />
                          {task.dueDate && (
                            <Chip
                              icon={<CalendarToday fontSize="small" />}
                              label={new Date(task.dueDate).toLocaleDateString()}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {task.assignedUser && (
                            <Chip
                              label={task.assignedUser.username}
                              size="small"
                              variant="outlined"
                              avatar={
                                <Avatar sx={{ width: 20, height: 20, fontSize: "0.75rem" }}>
                                  {task.assignedUser.username.charAt(0).toUpperCase()}
                                </Avatar>
                              }
                            />
                          )}
                        </Stack>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        sx={{ mt: -0.5 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </Stack>
      </CardContent>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={saveTask}
          users={users}
        />
      )}
    </Card>
  );
}
