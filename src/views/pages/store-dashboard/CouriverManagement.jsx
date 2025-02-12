import React from "react";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const pendingCourivers = [
  { id: 1, name: "Nguyen Van E", email: "e@example.com", appliedDate: "2024-02-12" },
  { id: 2, name: "Tran Thi F", email: "f@example.com", appliedDate: "2024-02-13" },
];

const activeCourivers = [
  { id: 201, name: "Le Van G", email: "g@example.com", startDate: "2023-07-10" },
  { id: 202, name: "Pham Thi H", email: "h@example.com", startDate: "2023-10-05" },
];

const CouriverManagement = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3">Pending Couriver Applications</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingCourivers.map((couriver) => (
              <TableRow key={couriver.id}>
                <TableCell>{couriver.id}</TableCell>
                <TableCell>{couriver.name}</TableCell>
                <TableCell>{couriver.email}</TableCell>
                <TableCell>{couriver.appliedDate}</TableCell>
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
        <Typography variant="h3">Current Courivers</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeCourivers.map((couriver) => (
              <TableRow key={couriver.id}>
                <TableCell>{couriver.id}</TableCell>
                <TableCell>{couriver.name}</TableCell>
                <TableCell>{couriver.email}</TableCell>
                <TableCell>{couriver.startDate}</TableCell>
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

export default CouriverManagement;