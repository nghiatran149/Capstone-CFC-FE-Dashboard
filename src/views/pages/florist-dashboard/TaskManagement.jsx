import React, { useState } from "react";
import {
    Box,
    Button,
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
    Card,
    CardMedia,
} from "@mui/material";

const initialTasks = [
    {
        id: 1,
        model: "Romantic Rose Basket",
        image: "https://shophoahong.com/wp-content/uploads/2021/12/183.jpg",
        details: "10 red roses, 10 blue roses",
        quantity: 2,
        deadline: "2024-02-15",
        status: "Pending",
        note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at felis ut turpis lobortis venenatis et quis nisl. Nullam finibus lacinia tincidunt.",
    },
    {
        id: 2,
        model: "Spring Lily Bouquet",
        image: "https://img.poemflowers.com/3BYRWbkpo-7qY33apS3agcdgiLmeUWPO7o6XIIld4j8/rs:fill:1200:1200:0/aHR0cHM6Ly9wb2VtZmxvd2Vycy5zZ3AxLmRpZ2l0YWxvY2VhbnNwYWNlcy5jb20vd2ViZWNvbS8yMDI0LzA3Lzg0MTUzOWUzODU1ZDQ2NjYwOTU5ZGNkZWMwZmNhMGJiLmpwZw.jpg",
        details: "5 white lilies, 5 pink lilies",
        quantity: 1,
        deadline: "2024-02-18",
        status: "In Progress",
        note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at felis ut turpis lobortis venenatis et quis nisl. Nullam finibus lacinia tincidunt.",
    },
    {
        id: 3,
        model: "Romantic Rose Basket",
        image: "https://shophoahong.com/wp-content/uploads/2021/12/183.jpg",
        details: "15 red roses, 15 blue roses",
        quantity: 1,
        deadline: "2024-02-15",
        status: "Completed",
        note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at felis ut turpis lobortis venenatis et quis nisl. Nullam finibus lacinia tincidunt.",
    },
];

const TaskManagement = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [filteredStatus, setFilteredStatus] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleStatusChange = (id, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, status: newStatus } : task
            )
        );
    };

    const handleFilterChange = (event) => {
        setFilteredStatus(event.target.value);
    };

    const handleOpenDialog = (task) => {
        setSelectedTask(task);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
    };

    const filteredTasks = filteredStatus
        ? tasks.filter((task) => task.status === filteredStatus)
        : tasks;

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h3">Florist Task Management</Typography>
                <Select value={filteredStatus} onChange={handleFilterChange} displayEmpty>
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </Select>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>View Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.model}</TableCell>
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
                                    <Button variant="outlined" color="primary" onClick={() => handleOpenDialog(task)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>Task Details</DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedTask && (
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="center" justifyContent="center">
                            <Card sx={{ width: 360, height: 360, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 3 }}>
                                <CardMedia
                                    component="img"
                                    image={selectedTask.image}
                                    alt={selectedTask.model}
                                    sx={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 4 }}
                                />
                            </Card>
                            <Box sx={{ width: 360 }}>
                                <Typography sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold' }}><strong>Model:</strong> {selectedTask.model}</Typography>
                                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Details:</strong> {selectedTask.details}</Typography>
                                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Quantity:</strong> {selectedTask.quantity}</Typography>
                                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Deadline:</strong> {selectedTask.deadline}</Typography>
                                <Typography sx={{ mb: 2, fontSize: '1.1rem' }}><strong>Note:</strong> {selectedTask.note}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskManagement;