import { IconDashboard, IconUsersGroup, IconDeviceDesktopCog, IconFlower, IconGiftCard, IconCreditCardRefund, IconCategory } from '@tabler/icons-react';

const icons = {
  IconDashboard,
  IconDeviceDesktopCog,
  IconGiftCard,
  IconCreditCardRefund
};

const adminDashboard = {
  id: 'adminDashboard',
  title: 'Admin Dashboard',
  caption: 'Management Dashboard for Admin',
  type: 'group',
  children: [
    {
      id: 'store',
      title: 'Store Overview',
      type: 'item',
      url: '/adminDashboard/store-overview',
      icon: IconDashboard,
      breadcrumbs: true
    },
    {
      id: 'customer',
      title: 'Customer Management',
      type: 'item',
      url: '/adminDashboard/customer-management',
      icon: IconUsersGroup,
      breadcrumbs: true
    },
    {
      id: 'category',
      title: 'Category Management',
      type: 'item',
      url: '/adminDashboard/category-management',
      icon: IconCategory,
      breadcrumbs: true
    },
    {
      id: 'product',
      title: 'Product Management',
      type: 'item',
      url: '/adminDashboard/product-management',
      icon: IconFlower,
      breadcrumbs: true
    },
    {
      id: 'promotion',
      title: 'Promotion Management',
      type: 'item',
      url: '/adminDashboard/promotion-management',
      icon: IconGiftCard,
      breadcrumbs: true
    },
    {
      id: 'refund',
      title: 'Refund Management',
      type: 'item',
      url: '/adminDashboard/refund-management',
      icon: IconCreditCardRefund,
      breadcrumbs: true
    },
  ]
};

export default adminDashboard;
