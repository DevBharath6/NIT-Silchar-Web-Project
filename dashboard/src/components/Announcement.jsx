import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Delete, Add, Edit, Save, Close } from "@mui/icons-material";
import api from "../services/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  const [notify, setNotify] = useState({ open: false, text: "", type: "success" });

  const show = (text, type = "success") =>
    setNotify({ open: true, text, type });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch {
      show("Failed to fetch announcements", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addAnnouncement = async () => {
    const msg = newMessage.trim();
    if (!msg) return show("Message cannot be empty", "error");

    try {
      const res = await api.post("/announcements", { message: msg });
      setAnnouncements([res.data, ...announcements]);
      setNewMessage("");
      show("Announcement added");
    } catch {
      show("Add failed", "error");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
      show("Deleted successfully");
    } catch {
      show("Delete failed", "error");
    }
  };

  const saveEdit = async () => {
    const msg = editMessage.trim();
    if (!msg) return show("Message cannot be empty", "error");

    try {
      const res = await api.put(`/announcements/${editId}`, { message: msg });
      setAnnouncements((prev) =>
        prev.map((a) => (a._id === editId ? res.data : a))
      );
      setEditId(null);
      setEditMessage("");
      show("Announcement updated");
    } catch {
      show("Update failed", "error");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>Manage Announcements</Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          fullWidth
          label="New Announcement"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addAnnouncement}
        >
          Add
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={2}>
          {announcements.length ? (
            announcements.map((a) => (
              <Paper
                key={a._id}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {editId === a._id ? (
                  <Stack direction="row" spacing={1} flex={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                    />
                    <IconButton color="success" onClick={saveEdit}>
                      <Save />
                    </IconButton>
                    <IconButton onClick={() => setEditId(null)} color="warning">
                      <Close />
                    </IconButton>
                  </Stack>
                ) : (
                  <>
                    <Typography sx={{ flex: 1 }}>{a.message}</Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => {
                          setEditId(a._id);
                          setEditMessage(a.message);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteAnnouncement(a._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </>
                )}
              </Paper>
            ))
          ) : (
            <Typography>No announcements found.</Typography>
          )}
        </Stack>
      )}

      <Snackbar
        open={notify.open}
        autoHideDuration={3000}
        onClose={() => setNotify((n) => ({ ...n, open: false }))}
      >
        <Alert severity={notify.type}>{notify.text}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcements;
