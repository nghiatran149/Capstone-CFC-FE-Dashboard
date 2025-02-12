import React from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const pendingFlorists = [
  { id: 1, name: "Nguyen Van A", email: "a@example.com", appliedDate: "2024-02-10" },
  { id: 2, name: "Tran Thi B", email: "b@example.com", appliedDate: "2024-02-11" },
];

const activeFlorists = [
  { id: 101, name: "Le Van C", email: "c@example.com", startDate: "2023-06-20" },
  { id: 102, name: "Pham Thi D", email: "d@example.com", startDate: "2023-09-15" },
];

const FloristManagement = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3">Pending Florist Applications</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingFlorists.map((florist) => (
              <TableRow key={florist.id}>
                <TableCell>{florist.id}</TableCell>
                <TableCell>{florist.name}</TableCell>
                <TableCell>{florist.email}</TableCell>
                <TableCell>{florist.appliedDate}</TableCell>
                <TableCell align="center">
                <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white', mr: 1, '&:hover': { backgroundColor: 'darkgreen' } }}>Approve</Button>
                <Button variant="contained" sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h3">Current Florists</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeFlorists.map((florist) => (
              <TableRow key={florist.id}>
                <TableCell>{florist.id}</TableCell>
                <TableCell>{florist.name}</TableCell>
                <TableCell>{florist.email}</TableCell>
                <TableCell>{florist.startDate}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FloristManagement;