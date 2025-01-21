import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { Button, Input, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import EarningCard from 'views/dashboard/EarningCard';
import TotalOrderLineChartCard from 'views/dashboard/TotalOrderLineChartCard';
import TotalGrowthBarChart from 'views/dashboard/TotalGrowthBarChart';

const StoreOverview = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/GetAllStore');
        const data = await response.json();
        setStores(data.data);
        if (data.data.length > 0) {
          setSelectedStore(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    fetchStores();
  }, []);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Store Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel>Select a store</InputLabel>
          <Select
            value={selectedStore ? selectedStore.storeId : ''}
            onChange={(e) => setSelectedStore(stores.find(store => store.storeId === e.target.value))}
            label="Select a store"
          >
            {stores.map((store) => (
              <MenuItem key={store.storeId} value={store.storeId}>
                {store.storeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
          onClick={() => setIsDialogOpen(true)}
          size="large"
          sx={{ marginLeft: '16px', padding: '8px 16px', flex: 0.3 }}
        >
          Add Store
        </Button>
      </Box>

      {/* Store Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <EarningCard
            revenue={selectedStore ? selectedStore.revenue : 0}
            expenses={selectedStore ? selectedStore.expenses : 0}
            profit={selectedStore ? selectedStore.profit : 0}
            isLoading={false}
          />
          <TotalOrderLineChartCard />
        </div>

        {selectedStore && (
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Store Name:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.storeName}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Address:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.address}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>City:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.city}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>District:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.district}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Phone:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.storePhone}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', flex: 1 }}>Store Email:</Typography>
                  <Typography variant="body1" sx={{ fontSize: '1rem', color: '#333' }}>{selectedStore.storeEmail}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
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
              {selectedStore && selectedStore.employees && selectedStore.employees.map((employee) => (
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
