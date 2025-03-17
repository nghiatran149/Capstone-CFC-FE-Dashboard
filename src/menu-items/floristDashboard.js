import { IconCalendarWeek, IconChecklist } from '@tabler/icons-react';

const icons = {
  IconCalendarWeek,
  IconChecklist,
};

const floristDashboard = {
  id: 'floristDashboard',
  title: 'Florist Dashboard',
  caption: 'Management Dashboard for Florist',
  type: 'group',
  children: [
    {
      id: 'task',
      title: 'Task Schedule',
      type: 'item',
      url: '/floristDashboard/task-schedule',
      icon: IconCalendarWeek,
      breadcrumbs: true
    },
    {
      id: 'task',
      title: 'Task Management',
      type: 'item',
      url: '/floristDashboard/task-management',
      icon: IconChecklist,
      breadcrumbs: true
    },
  ]
};

export default floristDashboard;
