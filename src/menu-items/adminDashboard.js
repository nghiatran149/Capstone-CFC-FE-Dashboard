// assets
import { IconDeviceDesktopCog } from '@tabler/icons-react';

// constant
const icons = {
    IconDeviceDesktopCog
};

// ==============================|| EXTRA MANAGEMENT MENU ITEMS ||============================== //

const adminDashboard = {
  id: 'adminDashboard',
  title: 'Admin Dashboard',
  // caption: 'Managements Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Management',
      type: 'collapse',
      icon: icons.IconDeviceDesktopCog,

      children: [
        {
          id: 'store',
          title: 'Store Overview',
          type: 'item',
          url: '/adminDashboard/store-overview',
          target: false
        },
        {
          id: 'promotion',
          title: 'Promotion Management',
          type: 'item',
          url: '/adminDashboard/promotion-management',
          target: false
        },
      ]
    }
  ]
};

export default adminDashboard;
