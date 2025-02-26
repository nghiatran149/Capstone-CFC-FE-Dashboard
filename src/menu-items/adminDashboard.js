import { IconDashboard, IconUsersGroup, IconFlower, IconGiftCard, IconCategory, IconGift, IconBasket, IconDiamond, IconSettings, IconCreditCardRefund } from '@tabler/icons-react';

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
      icon: IconGift,
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
    {
      id: 'custom',
      title: 'Custom Management',
      type: 'collapse',
      icon: IconSettings,
      children: [
        {
          id: 'flower',
          title: 'Flower Management',
          type: 'item',
          url: '/adminDashboard/flower-management',
          icon: IconFlower,
          breadcrumbs: true
        },
        {
          id: 'flowerBasket',
          title: 'Basket Management',
          type: 'item',
          url: '/adminDashboard/flowerbasket-management',
          icon: IconBasket,
          breadcrumbs: true
        },
        {
          id: 'style',
          title: 'Style Management',
          type: 'item',
          url: '/adminDashboard/style-management',
          icon: IconGiftCard,
          breadcrumbs: true
        },
        {
          id: 'accessory',
          title: 'Accessory Management',
          type: 'item',
          url: '/adminDashboard/accessory-management',
          icon: IconDiamond,
          breadcrumbs: true
        }
      ]
    }
  ]
};

export default adminDashboard;
