import { IconUserCog, IconUsersGroup, IconTruckDelivery, IconBasketCog } from '@tabler/icons-react';

const icons = {
  IconUserCog,
  IconUsersGroup,
  IconTruckDelivery,
  IconBasketCog
};

const storeDashboard = {
  id: 'storeDashboard',
  title: 'Store Dashboard',
  caption: 'Management Dashboard for Store Manager',
  type: 'group',
  children: [
    // {
    //   id: 'staff',
    //   title: 'Staff Management',
    //   type: 'item',
    //   url: '/storeDashboard/staff-management',
    //   icon: IconUserCog,
    //   breadcrumbs: true
    // },
    {
      id: 'florist',
      title: 'Florist Management',
      type: 'item',
      url: '/storeDashboard/florist-management',
      icon: IconUserCog,
      breadcrumbs: true
    },
    {
      id: 'couriver',
      title: 'Couriver Management',
      type: 'item',
      url: '/storeDashboard/couriver-management',
      icon: IconTruckDelivery,
      breadcrumbs: true
    },
    {
      id: 'order',
      title: 'Order Management',
      type: 'item',
      url: '/storeDashboard/order-management',
      icon: IconBasketCog,
      breadcrumbs: true
    },
  ]
};

export default storeDashboard;
