import React, { useState, useEffect } from 'react';
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

// Dữ liệu mẫu
const sampleOrders = [
    { id: 1, title: 'Order #1234', createdAt: '2025-03-17T08:30:00', customer: 'Nguyễn Văn A', status: 'pending', description: 'Đơn hàng máy tính xách tay' },
    { id: 2, title: 'Order #1235', createdAt: '2025-03-17T08:45:00', customer: 'Trần Thị B', status: 'completed', description: 'Đơn hàng điện thoại' },
    { id: 3, title: 'Order #1236', createdAt: '2025-03-17T14:45:00', customer: 'Lê Văn C', status: 'processing', description: 'Đơn hàng phụ kiện' },
    { id: 4, title: 'Order #1237', createdAt: '2025-03-18T09:20:00', customer: 'Phạm Thị D', status: 'pending', description: 'Đơn hàng thiết bị gia dụng' },
    { id: 5, title: 'Order #1238', createdAt: '2025-03-18T09:30:00', customer: 'Hoàng Văn E', status: 'completed', description: 'Đơn hàng thời trang' },
    { id: 6, title: 'Order #1239', createdAt: '2025-03-20T16:30:00', customer: 'Ngô Thị F', status: 'processing', description: 'Đơn hàng đồ chơi' },
    { id: 7, title: 'Order #1240', createdAt: '2025-03-20T16:45:00', customer: 'Đinh Văn G', status: 'pending', description: 'Đơn hàng sách' },
  ];

// Hàm chuyển đổi trạng thái thành tiếng Việt
const translateStatus = (status) => {
  switch (status) {
    case 'pending': return 'Chờ xử lý';
    case 'processing': return 'Đang xử lý';
    case 'completed': return 'Hoàn thành';
    default: return status;
  }
};

// Các khung giờ trong ngày (chỉ hiển thị từ 6:00 đến 22:00)
const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6).map(hour => ({
  hour,
  label: `${hour}:00 - ${hour + 1}:00`,
}));

const statusColors = {
  pending: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  processing: 'bg-blue-100 border-blue-400 text-blue-800',
  completed: 'bg-green-100 border-green-400 text-green-800',
};

const containerStyle = {
  display: 'table',
  width: '100%',
  borderCollapse: 'collapse', // Giữ lại đường kẻ ô
};

const rowStyle = {
  display: 'table-row',
};

const cellStyle = {
  display: 'table-cell',
  border: '1px solid #ccc', // Giữ lại đường kẻ ô
  padding: '4px',
  textAlign: 'center',
  height: '60px',
  verticalAlign: 'top',
};

const orderStyle = {
  marginBottom: '4px', // Thêm khoảng cách dưới mỗi order
};

function TaskSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [orders, setOrders] = useState(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getOrdersForTimeSlot = (day, hour) => {
    return orders.filter(order => {
      const orderDate = parseISO(order.createdAt);
      const orderHour = getHours(orderDate);

      // Kiểm tra nếu cùng ngày tháng năm và cùng giờ
      const sameDay = format(orderDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');

      return sameDay && orderHour === hour;
    });
  };

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
                        className={`p-1 border-l-4 cursor-pointer ${statusColors[order.status]}`}
                        elevation={1}
                        onClick={() => handleOrderClick(order)} // Thêm sự kiện onClick
                        style={orderStyle} // Áp dụng style order
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

      {/* Chi tiết order dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Typography variant="h6" className="font-bold">
                {selectedOrder.title}
              </Typography>
              <Typography variant="caption" className="block mt-1">
                Tạo lúc: {format(parseISO(selectedOrder.createdAt), 'HH:mm - dd/MM/yyyy')}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <div className="mb-3">
                <Typography variant="subtitle2" className="font-medium">Khách hàng:</Typography>
                <Typography variant="body2">{selectedOrder.customer}</Typography>
              </div>
              <div className="mb-3">
                <Typography variant="subtitle2" className="font-medium">Mô tả:</Typography>
                <Typography variant="body2">{selectedOrder.description}</Typography>
              </div>
              <div className="mb-2">
                <Typography variant="subtitle2" className="font-medium">Trạng thái:</Typography>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[selectedOrder.status]
                  }`}>
                  {translateStatus(selectedOrder.status)}
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default TaskSchedulePage;