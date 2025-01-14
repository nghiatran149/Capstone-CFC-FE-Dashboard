import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: 'Summer Sale',
      quantity: 100,
      discount: 20,
      code: 'SUMMER20',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
    },
    {
      id: 2,
      name: 'Black Friday',
      quantity: 200,
      discount: 50,
      code: 'BLACKFRIDAY50',
      startDate: '2025-11-27',
      endDate: '2025-11-30',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    quantity: '',
    discount: '',
    code: '',
    startDate: '',
    endDate: '',
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddPromotion = () => {
    setPromotions([
      ...promotions,
      { id: Date.now(), ...newPromotion, quantity: parseInt(newPromotion.quantity) },
    ]);
    setNewPromotion({
      name: '',
      quantity: '',
      discount: '',
      code: '',
      startDate: '',
      endDate: '',
    });
    setOpenDialog(false);
  };

  const handleDeletePromotion = (id) => {
    setPromotions(promotions.filter((promotion) => promotion.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Promotion Management</h2>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenDialog}>
          Add Promotion
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Discount (%)</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.id}</TableCell>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>{promotion.quantity}</TableCell>
                <TableCell>{promotion.discount}</TableCell>
                <TableCell>{promotion.code}</TableCell>
                <TableCell>{promotion.startDate}</TableCell>
                <TableCell>{promotion.endDate}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeletePromotion(promotion.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Promotion */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Promotion</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newPromotion.name}
            onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newPromotion.quantity}
            onChange={(e) => setNewPromotion({ ...newPromotion, quantity: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            value={newPromotion.discount}
            onChange={(e) => setNewPromotion({ ...newPromotion, discount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={newPromotion.code}
            onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={newPromotion.startDate}
            onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            value={newPromotion.endDate}
            onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPromotion}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionManagement;