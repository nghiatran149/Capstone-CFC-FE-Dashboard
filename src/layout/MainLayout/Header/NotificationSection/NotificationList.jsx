// NotificationList.jsx
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

// project-import
import Chip from 'ui-component/extended/Chip';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto, IconUser } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';

// Định dạng thời gian
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  // Tính toán sự khác biệt thời gian
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'Vừa xong';
  } else if (diffMin < 60) {
    return `${diffMin} phút trước`;
  } else if (diffHour < 24) {
    return `${diffHour} giờ trước`;
  } else if (diffDay < 7) {
    return `${diffDay} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN');
  }
};

const ListItemWrapper = ({ children, onClick }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'primary.light'
        }
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ notifications, markAsRead, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };

  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28
  };

  // Xử lý khi click vào một thông báo
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.notiId);
    }

    if (onClose) {
      onClose();
    }
    
    // Xử lý chuyển hướng hoặc các hành động khác tùy thuộc vào loại thông báo

    if (notification.relatedId) {
      switch (notification.type) {
        case 'Order':
          // navigate(`/order/detail/${notification.relatedId}`);
          navigate(`/floristDashboard/task-management?openOrderId=${notification.relatedId}`);
          break;
        case 'Product':
          navigate(`/product/detail/${notification.relatedId}`);
          break;
        case 'User':
          navigate(`/user/profile/${notification.relatedId}`);
          break;
        case 'Inventory':
          navigate(`/inventory/detail/${notification.relatedId}`);
          break;
        default:
          // Mặc định nếu không xác định được loại thông báo
          console.log('Không xác định được trang chuyển hướng cho loại thông báo:', notification.type);
          break;
      }
    } else {
      console.log('Notification clicked:', notification);
    }
  };

  // Hiển thị tin nhắn khi không có thông báo
  if (!notifications || notifications.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="subtitle1">Không có thông báo</Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiListItemSecondaryAction-root': {
          top: 22
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7
        }
      }}
    >
      {notifications.map((notification) => (
        <Box key={notification.notiId}>
          <ListItemWrapper onClick={() => handleNotificationClick(notification)}>
            <ListItem alignItems="center" disableGutters>
              <ListItemAvatar>
                <Avatar>
                  <IconUser stroke={1.5} size="1.3rem" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={notification.type || "Thông báo"} 
              />
              <ListItemSecondaryAction>
                <Grid container justifyContent="flex-end">
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {formatTime(notification.createAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItemSecondaryAction>
            </ListItem>
            <Grid container direction="column" className="list-container">
              <Grid item xs={12} sx={{ pb: 2 }}>
                <Typography variant="subtitle2">{notification.message}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  {!notification.isRead && (
                    <Grid item>
                      <Chip label="Chưa đọc" sx={chipErrorSX} />
                    </Grid>
                  )}
                  <Grid item>
                    <Chip label={notification.status || "New"} sx={chipWarningSX} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItemWrapper>
          <Divider />
        </Box>
      ))}
    </List>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.array,
  markAsRead: PropTypes.func,
  onClose: PropTypes.func
};

export default NotificationList;