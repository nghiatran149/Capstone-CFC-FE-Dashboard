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
} from '@mui/material';

const RefundManagement = () => {
  const [refunds] = useState([
    {
      refundId: '1',
      orderId: '1234',
      price: 100.5,
      walletId: 'w001',
      createAt: '2025-01-01',
      updateAt: '2025-01-02',
      status: 'Pending',
    },
    {
      refundId: '2',
      orderId: '5678',
      price: 50.0,
      walletId: 'w002',
      createAt: '2025-01-03',
      updateAt: '2025-01-04',
      status: 'Approved',
    },
    {
      refundId: '3',
      orderId: '91011',
      price: 70.0,
      walletId: 'w003',
      createAt: '2025-01-05',
      updateAt: '2025-01-06',
      status: 'Rejected',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'gold';
      case 'Rejected':
        return 'red';
      case 'Approved':
        return 'green';
      default:
        return 'black';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Refund Management</h2>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Refund ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Wallet ID</TableCell>
              <TableCell>Create At</TableCell>
              <TableCell>Update At</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refunds.map((refund) => (
              <TableRow key={refund.refundId}>
                <TableCell>{refund.refundId}</TableCell>
                <TableCell>{refund.orderId}</TableCell>
                <TableCell>{refund.price}</TableCell>
                <TableCell>{refund.walletId}</TableCell>
                <TableCell>{refund.createAt}</TableCell>
                <TableCell>{refund.updateAt}</TableCell>
                <TableCell style={{ color: getStatusColor(refund.status) }}>
                  {refund.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RefundManagement;
