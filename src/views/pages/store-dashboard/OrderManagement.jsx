import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';

const ordersData = [
    {
        orderId: '1001',
        customerName: 'John Doe',
        status: 'Completed',
        orderDetails: ['Rose Basket', 'Lily Basket'],
        price: '500000 VNĐ',
        address: '123 Flower St, NY',
        phone: '123-456-7890',
        orderTime: '2025-02-18 10:00',
        deliveryTime: '2025-02-18 15:00',
        note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at felis ut turpis lobortis venenatis et quis nisl. Nullam finibus lacinia tincidunt.',
    },
    {
        orderId: '1002',
        customerName: 'Jane Smith',
        status: 'Failed',
        orderDetails: ['Orchid Pot'],
        price: '500000 VNĐ',
        address: '456 Garden Ave, LA',
        phone: '987-654-3210',
        orderTime: '2025-02-18 12:30',
        deliveryTime: 'Failed',
        note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at felis ut turpis lobortis venenatis et quis nisl. Nullam finibus lacinia tincidunt.',
    },
    {
        orderId: '1003',
        customerName: 'Alice Brown',
        status: 'Processing',
        orderDetails: ['Tulip Bouquet'],
        price: '500000 VNĐ',
        address: '789 Bloom Rd, TX',
        phone: '555-555-5555',
        orderTime: '2025-02-18 14:00',
        deliveryTime: 'Processing',
        note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at felis ut turpis lobortis venenatis et quis nisl. Nullam finibus lacinia tincidunt.',
    },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'Completed':
            return 'green';
        case 'Failed':
            return 'red';
        case 'Processing':
            return 'gold';
        default:
            return 'black';
    }
};

const OrderManagement = () => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders =
        filterStatus === 'All'
            ? ordersData
            : ordersData.filter((order) => order.status === filterStatus);

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h2>Order Management</h2>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                </Select>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order.orderId}>
                                <TableCell>{order.orderId}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell style={{ color: getStatusColor(order.status) }}>{order.status}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => setSelectedOrder(order)}>
                                        View Order Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontSize: '1.3rem', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                    Order Details
                </DialogTitle>
                <DialogContent sx={{ p: 2, mx: 5 }}>
                    {selectedOrder && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                <strong>Customer Name:</strong> {selectedOrder.customerName}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                <strong>Order Details:</strong> {selectedOrder.orderDetails.join(', ')}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                <strong>Price:</strong> {selectedOrder.price}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                <strong>Address:</strong> {selectedOrder.address}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                <strong>Phone:</strong> {selectedOrder.phone}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                <strong>Order Time:</strong> {selectedOrder.orderTime}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                <strong>Delivery Time:</strong> {selectedOrder.deliveryTime}
                            </Typography>
                            <Typography sx={{ fontSize: '1rem' }}>
                                <strong>Note:</strong> {selectedOrder.note}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
                    <Button onClick={() => setSelectedOrder(null)} variant="contained" color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderManagement;