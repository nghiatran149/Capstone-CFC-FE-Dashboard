// assets
import { IconUserCog, IconUsersGroup, IconFlower } from '@tabler/icons-react';

// constant
const icons = {
  IconUserCog,
  IconUsersGroup,
  IconFlower
};

// ==============================|| EXTRA MANAGEMENT MENU ITEMS ||============================== //

const storeDashboard = {
  id: 'storeDashboard',
  title: 'Store Dashboard',
  // caption: 'Managements Caption',
  type: 'group',
  children: [
    {
      id: 'staff',
      title: 'Staff Management',
      type: 'item',
      url: '/storeDashboard/staff-management',
      icon: IconUserCog,
      breadcrumbs: true
    },
    {
      id: 'customer',
      title: 'Customer Management',
      type: 'item',
      url: '/storeDashboard/customer-management',
      icon: IconUsersGroup,
      breadcrumbs: true
    },
    {
      id: 'product',
      title: 'Product Management',
      type: 'item',
      url: '/storeDashboard/product-management',
      icon: IconFlower,
      breadcrumbs: true
    }
  ]
};

export default storeDashboard;
