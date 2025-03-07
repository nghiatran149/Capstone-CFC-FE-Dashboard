import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
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
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Stack,
    Chip,
    Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

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

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredStatus, setFilteredStatus] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [detailedOrder, setDetailedOrder] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                const decodedToken = jwtDecode(token);
                const staffId = decodedToken.Id;

                const response = await axios.get(
                    `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/GetOrderByStaffId?StaffId=${staffId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setTasks(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            const encodedStatus = encodeURIComponent(newStatus);
            await axios.put(
                `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/UpdateStatusOrderByStaffId?orderId=${orderId}&Status=${encodedStatus}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Refresh the tasks list
            const updatedTasks = tasks.map(task =>
                task.orderId === orderId ? { ...task, status: newStatus } : task
            );
            setTasks(updatedTasks);

            // If the dialog is open and showing this order, update its status
            if (detailedOrder && detailedOrder.orderId === orderId) {
                setDetailedOrder(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleFilterChange = (event) => {
        setFilteredStatus(event.target.value);
    };

    const handleOpenDialog = async (task) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(
                `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/GetOrderByOrderId?OrderId=${task.orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setDetailedOrder(response.data.data);
            setSelectedTask(task);
            setOpenDialog(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
        setDetailedOrder(null);
    };

    const filteredTasks = filteredStatus
        ? tasks.filter((task) => task.status === filteredStatus)
        : tasks;

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
                            <CardMedia
                                component="img"
                                image={customProduct.flowerBasketResponse.image}
                                alt={customProduct.flowerBasketResponse.flowerBasketName}
                                sx={{ height: 250, objectFit: 'cover' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Flower Basket Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">ID</Typography>
                                            <Typography>{customProduct.flowerBasketResponse.flowerBasketId}</Typography>
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
                            <CardMedia
                                component="img"
                                image={customProduct.styleResponse.image}
                                alt={customProduct.styleResponse.name}
                                sx={{ height: 250, objectFit: 'cover' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Style Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">ID</Typography>
                                            <Typography>{customProduct.styleResponse.styleId}</Typography>
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
                            <CardMedia
                                component="img"
                                image={customProduct.accessoryResponse.image}
                                alt={customProduct.accessoryResponse.name}
                                sx={{ height: 250, objectFit: 'cover' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Accessory Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="textSecondary">ID</Typography>
                                            <Typography>{customProduct.accessoryResponse.accessoryId}</Typography>
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
                                        <TableCell>ID</TableCell>
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
                                             <TableCell>{flower.flowerResponse.flowerId}</TableCell>
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
            <Box sx={{ mt: 2 }}>
                <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary" sx={{ borderBottom: '2px solid #FFE7EF', pb: 1 }}>
                            Product List
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product ID</TableCell>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Discount</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.orderDetails.map((detail) => (
                                        <TableRow key={detail.orderDetailId} hover>
                                            <TableCell>{detail.productId}</TableCell>
                                            <TableCell>
                                                <Avatar
                                                    src={detail.productImage}
                                                    alt={detail.productName}
                                                    variant="rounded"
                                                    sx={{ width: 50, height: 50 }}
                                                />
                                            </TableCell>
                                            <TableCell>{detail.productName}</TableCell>
                                            <TableCell align="right">{detail.quantity}</TableCell>
                                            <TableCell align="right">{formatPrice(detail.price)}</TableCell>
                                            <TableCell align="right">{detail.discount}%</TableCell>
                                            <TableCell align="right">
                                                <Typography color="primary" fontWeight="medium">
                                                    {formatPrice(detail.productTotalPrice)}
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

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h3">Florist Task Management</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                        label="All"
                        color={filteredStatus === "" ? "primary" : "default"}
                        onClick={() => setFilteredStatus("")}
                        sx={{
                            fontWeight: 500,
                            '&:hover': { opacity: 0.9 }
                        }}
                    />
                    <Chip
                        label="2️⃣ Arranging & Packing"
                        color={filteredStatus === "Arranging & Packing" ? "primary" : "default"}
                        onClick={() => setFilteredStatus("Arranging & Packing")}
                        sx={{
                            bgcolor: filteredStatus === "Arranging & Packing" ? undefined : '#fbcfe8',
                            color: filteredStatus === "Arranging & Packing" ? undefined : '#9d174d',
                            fontWeight: 500,
                            '&:hover': { opacity: 0.9 }
                        }}
                    />
                    <Chip
                        label="4️⃣ Awaiting Design Approval"
                        color={filteredStatus === "Awaiting Design Approval" ? "primary" : "default"}
                        onClick={() => setFilteredStatus("Awaiting Design Approval")}
                        sx={{
                            bgcolor: filteredStatus === "Awaiting Design Approval" ? undefined : '#fef9c3',
                            color: filteredStatus === "Awaiting Design Approval" ? undefined : '#854d0e',
                            fontWeight: 500,
                            '&:hover': { opacity: 0.9 }
                        }}
                    />
                    <Chip
                        label="5️⃣ Flower Completed"
                        color={filteredStatus === "Flower Completed" ? "primary" : "default"}
                        onClick={() => setFilteredStatus("Flower Completed")}
                        sx={{
                            bgcolor: filteredStatus === "Flower Completed" ? undefined : '#fed7aa',
                            color: filteredStatus === "Flower Completed" ? undefined : '#9a3412',
                            fontWeight: 500,
                            '&:hover': { opacity: 0.9 }
                        }}
                    />
                    <Chip
                        label="6️⃣ Received"
                        color={filteredStatus === "Received" ? "primary" : "default"}
                        onClick={() => setFilteredStatus("Received")}
                        sx={{
                            bgcolor: filteredStatus === "Received" ? undefined : '#bfdbfe',
                            color: filteredStatus === "Received" ? undefined : '#1e40af',
                            fontWeight: 500,
                            '&:hover': { opacity: 0.9 }
                        }}
                    />
                </Box>
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
                            {filteredTasks.map((task) => (
                                <TableRow key={task.orderId}>
                                    <TableCell>{task.orderId}</TableCell>
                                    <TableCell>
                                        {task.productCustomResponse ?
                                            task.productCustomResponse.productName :
                                            task.orderDetails.map(detail => detail.productName).join(", ")}
                                    </TableCell>
                                    <TableCell>{formatPrice(task.orderPrice)}</TableCell>
                                    <TableCell>{task.transfer ? "100% transfer" : "50% deposit"}</TableCell>
                                    <TableCell>{task.createAt}</TableCell>
                                    <TableCell>{formatDateTime(task.deliveryDateTime)}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Chip
                                                label={task.status}
                                                sx={{
                                                    bgcolor: task.status === "Arranging & Packing" ? '#fbcfe8' :
                                                        task.status === "Awaiting Design Approval" ? '#fef9c3' :
                                                            task.status === "Flower Completed" ? '#fed7aa' :
                                                                task.status === "Received" ? '#bfdbfe' : '#e5e7eb',
                                                    color: task.status === "Arranging & Packing" ? '#9d174d' :
                                                        task.status === "Awaiting Design Approval" ? '#854d0e' :
                                                            task.status === "Flower Completed" ? '#9a3412' :
                                                                task.status === "Received" ? '#1e40af' : '#374151',
                                                    fontWeight: 500,
                                                    '& .MuiChip-label': { px: 2 }
                                                }}
                                            />
                                            <Select
                                                size="small"
                                                value=""
                                                onChange={(e) => handleStatusChange(task.orderId, e.target.value)}
                                                sx={{ minWidth: 150 }}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>Change Status</MenuItem>
                                                <MenuItem value="Arranging & Packing">2️⃣ Arranging & Packing</MenuItem>
                                                <MenuItem value="Awaiting Design Approval">4️⃣ Awaiting Design Approval</MenuItem>
                                                <MenuItem value="Flower Completed">5️⃣ Flower Completed</MenuItem>
                                                <MenuItem value="Received">6️⃣Received</MenuItem>
                                            </Select>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outlined" onClick={() => handleOpenDialog(task)}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
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
                                                <Stack spacing={1} alignItems="flex-end">
                                                    <Chip
                                                        label={detailedOrder.status}
                                                        color={detailedOrder.status === 'Flower Completed' ? 'success' :
                                                            detailedOrder.status === 'Received' ? 'info' : 'warning'}
                                                        sx={{ mb: 1 }}
                                                    />
                                                    <Select
                                                        size="small"
                                                        value=""
                                                        onChange={(e) => handleStatusChange(detailedOrder.orderId, e.target.value)}
                                                        sx={{
                                                            minWidth: 200,
                                                            mb: 1,
                                                            '& .MuiSelect-select': { py: 1 }
                                                        }}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="" disabled>Change Status</MenuItem>
                                                        <MenuItem value="Awaiting Design Approval">4️⃣ Awaiting Design Approval</MenuItem>
                                                        <MenuItem value="Flower Completed">5️⃣ Flower Completed</MenuItem>
                                                        <MenuItem value="Received">6️⃣ Received</MenuItem>
                                                    </Select>
                                                    <Typography variant="h5" color="primary">
                                                        {formatPrice(detailedOrder.orderPrice)}
                                                    </Typography>
                                                </Stack>
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

                                {/* Order Notes */}
                                <Grid item xs={12}>
                                    <OrderSection>
                                        <Typography variant="h6" className="section-title">Order Notes</Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                            {detailedOrder.note}
                                        </Typography>
                                    </OrderSection>
                                </Grid>

                                {/* Payment Notes */}
                                <Grid item xs={12}>
                                    <OrderSection>
                                        <Typography variant="h6" className="section-title">Payment Notes</Typography>
                                        <Stack spacing={2}>
                                            <InfoRow>
                                                <Typography className="label">Payment ID</Typography>
                                                <Typography className="value">{detailedOrder.paymentId}</Typography>
                                            </InfoRow>
                                            <InfoRow>
                                                <Typography className="label">Payment Method</Typography>
                                                <Typography className="value">
                                                    <Chip
                                                        label={detailedOrder.paymentMethod}
                                                        color="info"
                                                        size="small"
                                                        sx={{ borderRadius: 1 }}
                                                    />
                                                </Typography>
                                            </InfoRow>
                                            <InfoRow>
                                                <Typography className="label">Payment Price</Typography>
                                                <Typography className="value" color="primary" fontWeight="500">
                                                    {formatPrice(detailedOrder.paymentPrice)}
                                                </Typography>
                                            </InfoRow>
                                            <InfoRow>
                                                <Typography className="label">Payment Status</Typography>
                                                <Typography className="value">
                                                    <Chip
                                                        label={detailedOrder.paymentStatus}
                                                        color={detailedOrder.paymentStatus === 'Completed' ? 'success' : 'warning'}
                                                        size="small"
                                                        sx={{ borderRadius: 1 }}
                                                    />
                                                </Typography>
                                            </InfoRow>
                                            <InfoRow>
                                                <Typography className="label">Create At</Typography>
                                                <Typography className="value">{formatDateTime(detailedOrder.paymentCreateAt)}</Typography>
                                            </InfoRow>
                                        </Stack>
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
                        onClick={handleCloseDialog}
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
            </Dialog>
        </Box>
    );
};

export default TaskManagement;