import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// Admin Dashboard
const StoreOverview = Loadable(lazy(() => import('views/pages/admin-dashboard/StoreOverview')));
const PromotionManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/PromotionManagement')));
const RefundManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/RefundManagement')));
const CategoryManagement = Loadable(lazy(() => import('views/pages/admin-dashboard/CategoryManagement')));

// Store Dashboard
const StaffManagement = Loadable(lazy(() => import('views/pages/store-dashboard/StaffManagement')));
const CustomerManagement = Loadable(lazy(() => import('views/pages/store-dashboard/CustomerManagement')));
const ProductManagement = Loadable(lazy(() => import('views/pages/store-dashboard/ProductManagement')));

// ==============================|| MAIN ROUTING ||============================== //

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
          path: 'customer-management',
          element: <CustomerManagement />
        }
      ]
    },
    {
      path: '/storeDashboard',
      children: [
        {
          path: 'product-management',
          element: <ProductManagement />
        }
      ]
    },
  ]
};

export default MainRoutes;
