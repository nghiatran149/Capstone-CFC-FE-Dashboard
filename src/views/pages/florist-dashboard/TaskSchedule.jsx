import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay, getHours } from 'date-fns';

// TIME (8:00 TO 22:00)
const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8).map(hour => ({
  hour,
  label: `${hour}:00 - ${hour + 1}:00`,
}));

// ORDER COLOR DỰA THEO STATUS NHƯNG ĐANG LỖI
const getStatusColor = (status) => {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'arranging & packing':
      return 'bg-yellow-100 border-yellow-400 text-yellow-800';
    case 'awaiting design approval':
      return 'bg-blue-100 border-blue-400 text-blue-800';
    case 'flower completed':
      return 'bg-green-100 border-green-400 text-green-800';
    case 'canceled':
      return 'bg-red-100 border-red-400 text-red-800';
    case 'delivery':
      return 'bg-purple-100 border-purple-400 text-purple-800';
    default:
      return 'bg-gray-100 border-gray-400 text-gray-800'; // Màu mặc định
  }
};

// CSS UI
const containerStyle = {
  display: 'table',
  width: '100%',
  borderCollapse: 'collapse',
};

const rowStyle = {
  display: 'table-row',
};

const cellStyle = {
  display: 'table-cell',
  border: '1px solid #ccc',
  padding: '4px',
  textAlign: 'center',
  height: '60px',
  verticalAlign: 'top',
};

const orderStyle = {
  marginBottom: '4px',
};


function TaskSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No token found');
          // setOrders(sampleOrders);
          setLoading(false);
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

        const formattedOrders = response.data.data.map(order => ({
          id: order.orderId,
          title: `Order #${order.orderId}`,
          createdAt: order.createAt,
          customer: order.customerId,
          status: order.status.toLowerCase(),
          description: order.note || 'Không có mô tả'
        }));

        setOrders(formattedOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // setOrders(sampleOrders);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && !selectedDate) {
      setSelectedDate(parseISO(orders[0].createdAt));
    }
  }, [orders]);

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days);
  }, [selectedDate]);

  const handlePrevWeek = () => {
    setSelectedDate(subDays(selectedDate, 7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleOrderClick = async (order) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/GetOrderByOrderId?OrderId=${order.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const detailedOrder = response.data.data;
      setSelectedOrder({
        ...order,
        details: detailedOrder
      });
      setDialogOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setSelectedOrder(order);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  const getOrdersForTimeSlot = (day, hour) => {
    return orders.filter(order => {
      const orderDate = parseISO(order.createdAt);
      const orderHour = getHours(orderDate);
      const sameDay = format(orderDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      return sameDay && orderHour === hour;
    });
  };


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

      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus.toLowerCase() } : order
      );
      setOrders(updatedOrders);

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus.toLowerCase() }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppBar position="static" className="bg-indigo-600">
        <Toolbar>
          <Button
            color="inherit"
            onClick={handleToday}
            className="ml-2"
          >
            This Week
          </Button>
          <IconButton
            color="inherit"
            onClick={handlePrevWeek}
            className="ml-2"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleNextWeek}
          >
            <ChevronRightIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div className="flex-grow overflow-auto p-4">
        <div style={containerStyle}>
          <div style={rowStyle}>
            {/* Cột thời gian */}
            <div style={cellStyle}>
              <Typography variant="subtitle2" className="font-bold text-gray-600">
                TIME/DATE
              </Typography>
            </div>
            {/* Các cột ngày */}
            {weekDays.map((day) => (
              <div key={day.toISOString()} style={cellStyle}>
                <Typography
                  variant="subtitle2"
                  className={`font-bold ${isSameDay(day, new Date()) ? 'text-indigo-600' : 'text-gray-600'
                    }`}
                >
                  {format(day, 'EEEE')}
                </Typography>
                <Typography
                  variant="body2"
                  className={`${isSameDay(day, new Date()) ? 'text-indigo-600' : 'text-gray-600'
                    }`}
                >
                  {format(day, 'dd/MM/yyyy')}
                </Typography>
              </div>
            ))}
          </div>

          {/* Các hàng thời gian */}
          {timeSlots.map((slot) => (
            <div style={rowStyle} key={slot.hour}>
              {/* Cột thời gian */}
              <div style={cellStyle}>
                <Typography variant="body2" className="text-gray-500">
                  {slot.label}
                </Typography>
              </div>
              {/* Các cột ngày */}
              {weekDays.map((day) => {
                const slotOrders = getOrdersForTimeSlot(day, slot.hour);
                return (
                  <div key={`${day.toISOString()}-${slot.hour}`} style={cellStyle}>
                    {slotOrders.map((order) => (
                      <Paper
                        key={order.id}
                        className={`p-1 border-l-4 cursor-pointer ${getStatusColor(order.status)}`}
                        elevation={1}
                        onClick={() => handleOrderClick(order)}
                        style={orderStyle}
                      >
                        <div className="flex justify-between items-center">
                          <Typography variant="body2" className="font-bold truncate">
                            {order.title}
                          </Typography>
                          <InfoIcon fontSize="small" className="text-gray-500" />
                        </div>
                        <Typography variant="caption" className="block truncate">
                          {format(parseISO(order.createdAt), 'HH:mm')} - {order.customer}
                        </Typography>
                      </Paper>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ORDER DETAILS DIALOG */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Typography variant="h6" className="font-bold">
                {selectedOrder.title}
              </Typography>
              <Typography variant="caption" className="block mt-1">
                Create At: {format(parseISO(selectedOrder.createdAt), 'HH:mm - dd/MM/yyyy')}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <div className="mb-3">
                <Typography variant="subtitle2" className="font-medium">Customer:</Typography>
                <Typography variant="body2">
                  {selectedOrder.details?.customerId || selectedOrder.customer}
                </Typography>
              </div>
              <div className="mb-3">
                <Typography variant="subtitle2" className="font-medium">Description:</Typography>
                <Typography variant="body2">
                  {selectedOrder.details?.note || selectedOrder.description}
                </Typography>
              </div>
              <div className="mb-2">
                <Typography variant="subtitle2" className="font-medium">Status:</Typography>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </div>
              </div>
              {selectedOrder.details && (
                <>
                  <div className="mb-3">
                    <Typography variant="subtitle2" className="font-medium">Payment:</Typography>
                    <Typography variant="body2">
                      {selectedOrder.details.transfer ? "100% chuyển khoản" : "50% đặt cọc"}
                    </Typography>
                  </div>
                  <div className="mb-3">
                    <Typography variant="subtitle2" className="font-medium">Shipping Method:</Typography>
                    <Typography variant="body2">
                      {selectedOrder.details.delivery ? "Giao hàng" : "Nhận tại cửa hàng"}
                    </Typography>
                  </div>
                  <div className="mb-3">
                    <Typography variant="subtitle2" className="font-medium">Shipping Date:</Typography>
                    <Typography variant="body2">
                      {format(parseISO(selectedOrder.details.deliveryDateTime), 'HH:mm - dd/MM/yyyy')}
                    </Typography>
                  </div>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {/* {selectedOrder.status !== "completed" && (
                                <Button
                                    onClick={() => handleStatusChange(selectedOrder.id, "completed")}
                                    variant="contained"
                                    color="primary"
                                >
                                    Đánh dấu hoàn thành
                                </Button>
                            )} */}
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default TaskSchedule;