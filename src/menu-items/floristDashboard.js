import { IconChecklist } from '@tabler/icons-react';

const icons = {
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
      title: 'Task Management',
      type: 'item',
      url: '/floristDashboard/task-management',
      icon: IconChecklist,
      breadcrumbs: true
    },
  ]
};

export default floristDashboard;
