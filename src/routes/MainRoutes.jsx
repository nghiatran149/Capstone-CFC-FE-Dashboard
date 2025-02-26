import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// Admin Dashboard
const StoreOverview = Loadable(lazy(() => import('views/pages/admin-dashboard/StoreOverview')));
const CustomerManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/CustomerManagement')));
const CategoryManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/CategoryManagement')));
const ProductManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/ProductManagement')));
const PromotionManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/PromotionManagement')));
const RefundManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/RefundManagement')));
const FlowerManagement =  Loadable(lazy(() => import('views/pages/admin-dashboard/FlowerManagement')));
const FlowerBasketManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/FlowerBasketManagement')));

const StyleManagement= Loadable(lazy(() => import('views/pages/admin-dashboard/StyleManagement')));
const AccessoryManagement =Loadable(lazy(() => import('views/pages/admin-dashboard/AccessoryManagement')));
// Store Dashboard
const StaffManagement = Loadable(lazy(() => import('views/pages/store-dashboard/StaffManagement')));
const FloristManagement = Loadable(lazy(() => import('views/pages/store-dashboard/FloristManagement')));
const CouriverManagement = Loadable(lazy(() => import('views/pages/store-dashboard/CouriverManagement')));
const OrderManagement = Loadable(lazy(() => import('views/pages/store-dashboard/OrderManagement')));

// Florist Dashboard
const TaskManagement = Loadable(lazy(() => import('views/pages/florist-dashboard/TaskManagement')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },

    // Admin Dashboard
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'store-overview',
          element: <StoreOverview />
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'customer-management',
          element: <CustomerManagement />
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'promotion-management',
          element: <PromotionManagement />
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'refund-management',
          element: <RefundManagement />
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'category-management',
          element: <CategoryManagement />
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'product-management',
          element: <ProductManagement />
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'flower-management',
          element: <FlowerManagement/>
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'style-management',
          element: <StyleManagement/>
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'accessory-management',
          element: <AccessoryManagement/>
        }
      ]
    },
    {
      path: '/adminDashboard',
      children: [
        {
          path: 'flowerbasket-management',
          element: <FlowerBasketManagement/>
        }
      ]
    },

    // Store Dashboard
    {
      path: '/storeDashboard',
      children: [
        {
          path: 'staff-management',
          element: <StaffManagement />
        }
      ]
    },
    {
      path: '/storeDashboard',
      children: [
        {
          path: 'florist-management',
          element: <FloristManagement />
        }
      ]
    },
    {
      path: '/storeDashboard',
      children: [
        {
          path: 'couriver-management',
          element: <CouriverManagement />
        }
      ]
    },
    {
      path: '/storeDashboard',
      children: [
        {
          path: 'order-management',
          element: <OrderManagement />
        }
      ]
    },

    // Florist Dashboard
    {
      path: '/floristDashboard',
      children: [
        {
          path: 'task-management',
          element: <TaskManagement />
        }
      ]
    },
  ]
};

export default MainRoutes;
