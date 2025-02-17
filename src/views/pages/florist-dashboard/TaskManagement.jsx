import React, { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const initialTasks = [
    {
        id: 1,
        model: "Romantic Rose Basket",
        details: "10 red roses, 10 blue roses",
        quantity: 2,
        deadline: "2024-02-15",
        status: "Pending",
        image: "",
    },
    {
        id: 2,
        model: "Spring Lily Bouquet",
        details: "5 white lilies, 5 pink lilies",
        quantity: 1,
        deadline: "2024-02-18",
        status: "In Progress",
        image: "",
    },
];

const TaskManagement = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [uploadedImage, setUploadedImage] = useState("");

    const handleStatusChange = (id, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, status: newStatus } : task
            )
        );
    };

    const handleOpenDialog = (task) => {
        setSelectedTask(task);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setUploadedImage("");
    };

    const handleImageUpload = () => {
        if (selectedTask) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === selectedTask.id ? { ...task, image: uploadedImage } : task
                )
            );
        }
        handleCloseDialog();
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h3">Florist Task Management</Typography>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.model}</TableCell>
                                <TableCell>{task.details}</TableCell>
                                <TableCell>{task.quantity}</TableCell>
                                <TableCell>{task.deadline}</TableCell>
                                <TableCell>
                                    <Select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CloudUpload />}
                                        onClick={() => handleOpenDialog(task)}
                                    >
                                        Upload Image
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Upload Image for Approval</DialogTitle>
                <DialogContent>
                    <TextField
                        type="text"
                        label="Image URL"
                        fullWidth
                        variant="outlined"
                        value={uploadedImage}
                        onChange={(e) => setUploadedImage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleImageUpload}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskManagement;