import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const [newPromotion, setNewPromotion] = useState({
    promotionName: "",
    quantity: "",
    promotionDiscount: "",
    promotionCode: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(
          "https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPromotions(data);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleAddPromotion = async () => {
    try {
      const response = await fetch(
        "https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions/create-promotion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newPromotion,
            quantity: parseInt(newPromotion.quantity),
            promotionDiscount: parseInt(newPromotion.promotionDiscount),
            createAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const createdPromotion = {
        ...result.data,
        startDate: result.data.startDate.split("T")[0],
        endDate: result.data.endDate.split("T")[0],
      };

      setPromotions((prev) => [...prev, createdPromotion]);

      setNewPromotion({
        promotionName: "",
        quantity: "",
        promotionDiscount: "",
        promotionCode: "",
        startDate: "",
        endDate: "",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to create promotion:", error);
    }
  };

  const handleDeletePromotion = async (id) => {
    try {
      const response = await fetch(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions/delete-promotion?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.resultStatus === "Success") {
        setPromotions((prev) =>
          prev.filter((promo) => promo.promotionId !== id)
        );
        alert("Promotion deleted successfully!");
      } else {
        alert(result.messages[0] || "Failed to delete promotion.");
      }
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      alert("An error occurred while deleting the promotion.");
    }
  };

  const handleEditPromotion = async () => {
    if (!selectedPromotion) return;
  
    try {
      const response = await fetch(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions/${selectedPromotion.promotionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...selectedPromotion,
            quantity: parseInt(selectedPromotion.quantity),
            promotionDiscount: parseInt(selectedPromotion.promotionDiscount),
            updateAt: new Date().toISOString(),
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedPromotion = await response.json();

      setPromotions((prev) =>
        prev.map((promo) =>
          promo.promotionId === updatedPromotion.promotionId
            ? {
                ...updatedPromotion,
                startDate: updatedPromotion.startDate.split("T")[0],
                endDate: updatedPromotion.endDate.split("T")[0],
              }
            : promo
        )
      );

      setEditDialog(false);
      setSelectedPromotion(null);
    } catch (error) {
      console.error("Failed to update promotion:", error);
    }
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
              <TableRow key={promotion.promotionId}>
                <TableCell>{promotion.promotionName}</TableCell>
                <TableCell>{promotion.quantity}</TableCell>
                <TableCell>{promotion.promotionDiscount}</TableCell>
                <TableCell>{promotion.promotionCode}</TableCell>
                <TableCell>{new Date(promotion.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(promotion.endDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedPromotion(promotion);
                      setEditDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete this promotion: ${promotion.promotionName}?`
                        )
                      ) {
                        handleDeletePromotion(promotion.promotionId);
                      }
                    }}
                  >
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
            value={newPromotion.promotionName}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, promotionName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newPromotion.quantity}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, quantity: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            value={newPromotion.promotionDiscount}
            onChange={(e) =>
              setNewPromotion({
                ...newPromotion,
                promotionDiscount: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={newPromotion.promotionCode}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, promotionCode: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPromotion.startDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, startDate: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPromotion.endDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, endDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPromotion}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Editing Promotion */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Promotion</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedPromotion?.promotionName || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                promotionName: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={selectedPromotion?.quantity || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                quantity: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Discount (%)"
            type="number"
            fullWidth
            value={selectedPromotion?.promotionDiscount || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                promotionDiscount: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={selectedPromotion?.promotionCode || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                promotionCode: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedPromotion?.startDate || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                startDate: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedPromotion?.endDate || ""}
            onChange={(e) =>
              setSelectedPromotion({
                ...selectedPromotion,
                endDate: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditPromotion}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionManagement;
