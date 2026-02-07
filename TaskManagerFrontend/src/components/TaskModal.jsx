import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import { Close, Send, Save, Comment } from "@mui/icons-material";
import API from "../api/api";

export default function TaskModal({ task, onClose, onSave, users }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [dueDate, setDueDate] = useState(task?.dueDate?.split("T")[0] || "");
  const [assignedUserId, setAssignedUserId] = useState(task?.assignedUserId || "");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (task?.id) fetchComments();
  }, [task]);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/tasks/${task.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    onSave({
      ...task,
      title,
      description,
      priority,
      dueDate: dueDate || null,
      assignedUserId: assignedUserId || null,
    });
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await API.post(`/tasks/${task.id}/comments`, { content: newComment, userId: user.id });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Add comment error:", err.response?.data || err.message);
      alert("Failed to add comment: " + (err.response?.data?.title || err.message));
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return "error";
    if (priority === "Low") return "success";
    return "warning";
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          fontWeight: 700,
        }}
      >
        {task?.id ? "Edit Task" : "Create New Task"}
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            autoFocus
            placeholder="Enter task title..."
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Add a detailed description..."
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)} label="Priority">
                <MenuItem value="Low">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                      }}
                    />
                    <Typography>Low</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="Medium">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "warning.main",
                      }}
                    />
                    <Typography>Medium</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="High">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                      }}
                    />
                    <Typography>High</Typography>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Stack>

          <FormControl fullWidth>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              label="Assign To"
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                      {u.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography>{u.username}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {task?.id && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                  <Comment /> Comments
                </Typography>

                <Stack spacing={2} sx={{ mb: 2, maxHeight: 200, overflowY: "auto" }}>
                  {comments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                      No comments yet
                    </Typography>
                  ) : (
                    comments.map((c) => (
                      <Paper
                        key={c.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: "8px",
                          bgcolor: "background.default",
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                            {c.user?.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {c.user?.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {c.content}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))
                  )}
                </Stack>

                <Stack direction="row" spacing={1}>
                  <TextField
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addComment()}
                    fullWidth
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={addComment}
                    disabled={!newComment.trim()}
                    sx={{ px: 3 }}
                  >
                    <Send fontSize="small" />
                  </Button>
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<Save />}
          sx={{ px: 3 }}
        >
          {task?.id ? "Update Task" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
