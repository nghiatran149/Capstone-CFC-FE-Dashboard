// assets
import { IconDashboard, IconDeviceDesktopCog, IconGiftCard, IconCreditCardRefund } from '@tabler/icons-react';

// constant
const icons = {
  IconDashboard,
  IconDeviceDesktopCog,
  IconGiftCard,
  IconCreditCardRefund
};

// ==============================|| EXTRA MANAGEMENT MENU ITEMS ||============================== //

const adminDashboard = {
  id: 'adminDashboard',
  title: 'Admin Dashboard',
  // caption: 'Caption',
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
