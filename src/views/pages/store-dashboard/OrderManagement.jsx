import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
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
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Stack,
    Chip,
    Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const getStatusColor = (status) => {
    switch (status) {
        case 'Order Successfully':
            return 'green';
        case 'Failed':
            return 'red';
        case 'Processing':
            return '#FFA500';
        default:
            return 'black';
    }
};

const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        padding: theme.spacing(2),
    }
}));

const OrderInfoCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f6f8fd 0%, #ffffff 100%)',
    borderRadius: 12,
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(3),
}));

const DetailSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    background: '#ffffff',
    borderRadius: 8,
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(2),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    '& img': {
        borderRadius: 8,
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'scale(1.05)',
        },
    },
}));

const OrderSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    background: '#ffffff',
    borderRadius: 12,
    marginBottom: theme.spacing(3),
    border: '1px solid #e0e0e0',
    '& .section-title': {
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: theme.spacing(2),
        marginBottom: theme.spacing(3),
    }
}));

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& .label': {
        color: theme.palette.text.secondary,
        width: '140px',
        flexShrink: 0,
    },
    '& .value': {
        flex: 1,
        fontWeight: 500,
    }
}));

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailedOrder, setDetailedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                const decodedToken = jwtDecode(token);
                const storeId = decodedToken.StoreId;

                const response = await axios.get(
                    `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/GetOrderByStore?StoreId=${storeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log('API Response:', response.data);
                setOrders(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders =
        filterStatus === 'All'
            ? orders
            : orders.filter((order) => order.status === filterStatus);

    const getOrderItems = (order) => {
        if (order.productCustomResponse) {
            return [
                {
                    name: order.productCustomResponse.productName,
                    quantity: order.productCustomResponse.quantity,
                    price: order.orderPrice
                }
            ];
        } else if (order.orderDetails) {
            return order.orderDetails.map(detail => ({
                name: detail.productName,
                quantity: detail.quantity,
                price: detail.productTotalPrice
            }));
        }
        return [];
    };

    const handleViewDetails = async (order) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(
                `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/GetOrderByOrderId?OrderId=${order.orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setDetailedOrder(response.data.data);
            setSelectedOrder(order);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const renderCustomOrderDetails = (order) => {
        const customProduct = order.productCustomResponse;
        return (
            <Box sx={{ mt: 2 }}>
                {/* Custom Product Information */}
                <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)', bgcolor: '#0000' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid #FFE7EF', pb: 1 }}>
                            Custom Product Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary">Product Name</Typography>
                                        <Typography variant="h6">{customProduct.productName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary">Total Price</Typography>
                                        <Typography variant="h6" color="primary">
                                            {formatPrice(customProduct.totalPrice)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary">Quantity</Typography>
                                        <Typography>{customProduct.quantity}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                                        <Typography>{customProduct.description || 'No description'}</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Flower Basket Section */}
                <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <ImageContainer>
                                <CardMedia
                                    component="img"
                                    image={customProduct.flowerBasketResponse.image}
                                    alt={customProduct.flowerBasketResponse.flowerBasketName}
                                    sx={{ height: 250, objectFit: 'cover' }}
                                />
                            </ImageContainer>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Flower Basket Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                                            <Typography>{customProduct.flowerBasketResponse.flowerBasketName}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                                            <Typography>{customProduct.flowerBasketResponse.categoryName}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                                            <Typography color="primary">{formatPrice(customProduct.flowerBasketResponse.price)}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">Quantity Range</Typography>
                                            <Typography>{customProduct.flowerBasketResponse.minQuantity} - {customProduct.flowerBasketResponse.maxQuantity}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                                            <Typography>{customProduct.flowerBasketResponse.decription}</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                {/* Style Section */}
                <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <ImageContainer>
                                <CardMedia
                                    component="img"
                                    image={customProduct.styleResponse.image}
                                    alt={customProduct.styleResponse.name}
                                    sx={{ height: 250, objectFit: 'cover' }}
                                />
                            </ImageContainer>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Style Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">Style Name</Typography>
                                            <Typography>{customProduct.styleResponse.name}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                                            <Typography>{customProduct.styleResponse.categoryName}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">Note</Typography>
                                            <Typography>{customProduct.styleResponse.note}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                                            <Typography>{customProduct.styleResponse.description}</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                {/* Accessory Section */}
                <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <ImageContainer>
                                <CardMedia
                                    component="img"
                                    image={customProduct.accessoryResponse.image}
                                    alt={customProduct.accessoryResponse.name}
                                    sx={{ height: 250, objectFit: 'cover' }}
                                />
                            </ImageContainer>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Accessory Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                                            <Typography>{customProduct.accessoryResponse.name}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                                            <Typography>{customProduct.accessoryResponse.categoryName}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                                            <Typography color="primary">{formatPrice(customProduct.accessoryResponse.price)}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">Note</Typography>
                                            <Typography>{customProduct.accessoryResponse.note}</Typography>
                                            <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                                            <Typography>{customProduct.accessoryResponse.description}</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                {/* Flowers Used Section */}
                <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                            Flowers Used
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Flower Name</TableCell>
                                        <TableCell>Color</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Total Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customProduct.flowerCustomResponses.map((flower) => (
                                        <TableRow key={flower.flowerCustomId} hover>
                                            <TableCell>
                                                <Avatar
                                                    src={flower.flowerResponse.image}
                                                    alt={flower.flowerResponse.flowerName}
                                                    variant="rounded"
                                                    sx={{ width: 50, height: 50 }}
                                                />
                                            </TableCell>
                                            <TableCell>{flower.flowerResponse.flowerName}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={flower.flowerResponse.color}
                                                    size="small"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            </TableCell>
                                            <TableCell>{flower.flowerResponse.categoryName}</TableCell>
                                            <TableCell align="right">{formatPrice(flower.flowerResponse.price)}</TableCell>
                                            <TableCell align="right">{flower.quantity}</TableCell>
                                            <TableCell align="right">
                                                <Typography color="primary" fontWeight="medium">
                                                    {formatPrice(flower.totalPrice)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        );
    };

    const renderRegularOrderDetails = (order) => {
        return (
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                             <TableCell>Product ID</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Discount</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.orderDetails.map((detail) => (
                            <TableRow key={detail.orderDetailId}>
                                <TableCell>{detail.productId}</TableCell>
                                <TableCell>{detail.productName}</TableCell>
                                <TableCell>
                                    <img 
                                        src={detail.productImage} 
                                        alt={detail.productName} 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </TableCell>
                                <TableCell align="right">{detail.quantity}</TableCell>
                                <TableCell align="right">{formatPrice(detail.price)}</TableCell>
                                <TableCell align="right">{detail.discount}%</TableCell>
                                <TableCell align="right">{formatPrice(detail.productTotalPrice)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h2>Order Management</h2>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Order Successfully">Completed</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                </Select>
            </Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Order Price</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell>Create Time</TableCell>
                                <TableCell>RecipientTime</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.orderId}>
                                    <TableCell>{order.orderId}</TableCell>
                                    <TableCell>{order.productCustomResponse ?[order.productCustomResponse.productName] :  order.orderDetails.map(detail => detail.productName)}</TableCell>
                                    <TableCell>{formatPrice(order.orderPrice)}</TableCell>
                                    <TableCell>{order.transfer ? "100% transfer" : "50% deposit"}</TableCell>
                                    <TableCell>{order.createAt}</TableCell>
                                    <TableCell>{formatDateTime(order.deliveryDateTime)}</TableCell>
                                    <TableCell style={{ color: getStatusColor(order.status) }}>
                                        {order.status}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleViewDetails(order)}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <StyledDialog 
                open={!!selectedOrder} 
                onClose={() => {
                    setSelectedOrder(null);
                    setDetailedOrder(null);
                }} 
                maxWidth="lg" 
                fullWidth
            >
                <DialogTitle sx={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f6f8fd 0%, #ffffff 100%)',
                    borderRadius: '12px 12px 0 0',
                    padding: 3,
                }}>
                    Order Details
                </DialogTitle>
                <DialogContent sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                    {detailedOrder && (
                        <Box>
                            <Grid container spacing={3}>
                                {/* Main Order Information */}
                                <Grid item xs={12}>
                                    <OrderSection>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                            <Box>
                                                <Typography variant="h5" gutterBottom>Order #{detailedOrder.orderId}</Typography>
                                                <Typography variant="body1" color="textSecondary">
                                                    Created at {formatDateTime(detailedOrder.createAt)}
                                                </Typography>
                                                <Typography variant="body1" color="textSecondary">
                                                    Updated at {formatDateTime(detailedOrder.updateAt)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Chip 
                                                    label={detailedOrder.status}
                                                    color={detailedOrder.status === 'Order Successfully' ? 'success' : 
                                                           detailedOrder.status === 'Failed' ? 'error' : 'warning'}
                                                    sx={{ mb: 1 }}
                                                />
                                                <Typography variant="h5" color="primary">
                                                    {formatPrice(detailedOrder.orderPrice)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Grid container spacing={4}>
                                            {/* Order Details Column */}
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h6" className="section-title">Order Details</Typography>
                                                <Stack spacing={2}>
                                                    <InfoRow>
                                                        <Typography className="label">Payment Method</Typography>
                                                        <Typography className="value">
                                                            {detailedOrder.transfer ? "100% transfer" : "50% deposit"}
                                                        </Typography>
                                                    </InfoRow>
                                                    <InfoRow>
                                                        <Typography className="label">Delivery Date</Typography>
                                                        <Typography className="value">
                                                            {formatDateTime(detailedOrder.deliveryDateTime)}
                                                        </Typography>
                                                    </InfoRow>
                                                    {detailedOrder.promotionName && (
                                                        <InfoRow>
                                                            <Typography className="label">Promotion</Typography>
                                                            <Box className="value">
                                                                <Typography>{detailedOrder.promotionName}</Typography>
                                                                <Chip
                                                                    label={`${detailedOrder.promotionDiscount}% off`}
                                                                    color="secondary"
                                                                    size="small"
                                                                    sx={{ mt: 0.5 }}
                                                                />
                                                            </Box>
                                                        </InfoRow>
                                                    )}
                                                </Stack>
                                            </Grid>

                                            {/* Contact Information Column */}
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h6" className="section-title">Contact Information</Typography>
                                                <Stack spacing={2}>
                                                    <InfoRow>
                                                        <Typography className="label">Store</Typography>
                                                        <Box className="value">
                                                            <Typography>{detailedOrder.storeName}</Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {detailedOrder.storeAddress}
                                                            </Typography>
                                                        </Box>
                                                    </InfoRow>
                                                    <InfoRow>
                                                        <Typography className="label">Customer ID</Typography>
                                                        <Typography className="value">{detailedOrder.customerId}</Typography>
                                                    </InfoRow>
                                                    <InfoRow>
                                                        <Typography className="label">Phone</Typography>
                                                        <Typography className="value">{detailedOrder.phone}</Typography>
                                                    </InfoRow>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </OrderSection>
                                </Grid>

                                {/* Staff Information */}
                                {detailedOrder.staffId && (
                                    <Grid item xs={12}>
                                        <OrderSection>
                                            <Typography variant="h6" className="section-title">Staff Information</Typography>
                                            <Grid container spacing={4}>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={2}>
                                                        <InfoRow>
                                                            <Typography className="label">Staff ID</Typography>
                                                            <Typography className="value">{detailedOrder.staffId}</Typography>
                                                        </InfoRow>
                                                        <InfoRow>
                                                            <Typography className="label">Name</Typography>
                                                            <Typography className="value">{detailedOrder.staffFullName}</Typography>
                                                        </InfoRow>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Stack spacing={2}>
                                                        <InfoRow>
                                                            <Typography className="label">Email</Typography>
                                                            <Typography className="value">{detailedOrder.staffEmail}</Typography>
                                                        </InfoRow>
                                                        <InfoRow>
                                                            <Typography className="label">Phone</Typography>
                                                            <Typography className="value">{detailedOrder.staffPhone}</Typography>
                                                        </InfoRow>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </OrderSection>
                                    </Grid>
                                )}

                                {/* Order Notes */}
                                <Grid item xs={12}>
                                    <OrderSection>
                                        <Typography variant="h6" className="section-title">Order Notes</Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                            {detailedOrder.note}
                                        </Typography>
                                    </OrderSection>
                                </Grid>

                                {/* Product Details */}
                                <Grid item xs={12}>
                                    <OrderSection>
                                        <Typography variant="h6" className="section-title">
                                            {detailedOrder.productCustomResponse ? 'Custom Product Details' : 'Product Details'}
                                        </Typography>
                                        {detailedOrder.productCustomResponse 
                                            ? renderCustomOrderDetails(detailedOrder)
                                            : renderRegularOrderDetails(detailedOrder)
                                        }
                                    </OrderSection>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                    <Button 
                        onClick={() => {
                            setSelectedOrder(null);
                            setDetailedOrder(null);
                        }} 
                        variant="contained" 
                        color="secondary"
                        sx={{ 
                            borderRadius: 2,
                            px: 4,
                            py: 1,
                            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </StyledDialog>
        </Box>
    );
};

export default OrderManagement;