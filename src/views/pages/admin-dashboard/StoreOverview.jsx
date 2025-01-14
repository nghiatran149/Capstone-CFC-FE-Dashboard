import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { Button, Input, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import EarningCard from 'views/dashboard/EarningCard';
import TotalOrderLineChartCard from 'views/dashboard/TotalOrderLineChartCard';
import TotalGrowthBarChart from 'views/dashboard/TotalGrowthBarChart';

const StoreOverview = () => {
  const stores = [
    {
      id: 1,
      name: "Store A",
      address: "123 Main St",
      revenue: 175000,
      expenses: 110000,
      profit: 65000,
      employees: [
        { id: 1, name: "John Doe", position: "Store Manager", phone: "123-456-7890" },
        { id: 2, name: "Jane Smith", position: "Florist", phone: "123-456-7891" },
        { id: 3, name: "Jack Thomas", position: "Couriver", phone: "123-456-7892" },
      ]
    },
    {
      id: 2,
      name: "Store B",
      address: "456 Oak St",
      revenue: 265000,
      expenses: 140000,
      profit: 125000,
      employees: [
        { id: 3, name: "Mike Johnson", position: "Store Manager", phone: "123-456-7893" },
        { id: 4, name: "Sarah Wilson", position: "Florist", phone: "123-456-7894" },
        { id: 3, name: "Daniel Tom", position: "Couriver", phone: "123-456-7895" },
      ]
    },
    {
      id: 3,
      name: "Store C",
      address: "789 Fal St",
      revenue: 390000,
      expenses: 220000,
      profit: 170000,
      employees: [
        { id: 3, name: "David James", position: "Store Manager", phone: "123-456-7896" },
        { id: 4, name: "William House", position: "Florist", phone: "123-456-7897" },
        { id: 3, name: "Henry Carlos", position: "Couriver", phone: "123-456-7898" },
      ]
    },
  ];

  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Store Selector */}
      <FormControl fullWidth>
        <InputLabel>Select a store</InputLabel>
        <Select
          value={selectedStore.id}
          onChange={(e) => setSelectedStore(stores.find(store => store.id === e.target.value))}
          label="Select a store"
        >
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Store Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Revenue Overview */}
        <EarningCard
          revenue={selectedStore.revenue}
          expenses={selectedStore.expenses}
          profit={selectedStore.profit}
          isLoading={false}
        />

        <TotalOrderLineChartCard />

        {/* Store Information */}
        <Card sx={{ boxShadow: 3, borderRadius: '16px', backgroundColor: '#ffffff' }}>
          <CardHeader
            title="Store Information"
            sx={{
              backgroundColor: '#b3ecff',
              color: 'white',
              textAlign: 'center',
              fontSize: '1.25rem',
              fontWeight: '600',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '16px'
            }}
          />
          <CardContent sx={{ padding: '24px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Store Name */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Store Name:</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#333' }}>{selectedStore.name}</Typography>
              </Box>

              {/* Address */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Address:</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#333' }}>{selectedStore.address}</Typography>
              </Box>

              {/* Total Employees */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Total Employees:</Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#333' }}>
                  {selectedStore.employees.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      <TotalGrowthBarChart />

      {/* Employees Table */}
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          title="Employees"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              color="primary"
              onClick={() => setIsDialogOpen(true)}
              size="large"
              sx={{ marginLeft: 0 }}
            >
              Add Store
            </Button>
          }
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedStore.employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog to add store */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        sx={{ '& .MuiDialog-paper': { width: '500px', padding: '24px' } }}
      >
        <DialogTitle>Add New Store</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input placeholder="Store Name" fullWidth />
            <Input placeholder="Address" fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="error">Cancel</Button>
          <Button onClick={() => setIsDialogOpen(false)} color="success">Add Store</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StoreOverview;
