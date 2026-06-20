export const TASK_TYPES = {
  PENDING_DELIVERY: 'pendingDelivery',
  IN_RENT: 'inRent',
  PENDING_ACCEPTANCE: 'pendingAcceptance',
  PENDING_REPAIR: 'pendingRepair',
  AFTER_SALE: 'afterSale',
  ALL: 'all'
};

export const TASK_LABELS = {
  [TASK_TYPES.ALL]: '全部任务',
  [TASK_TYPES.PENDING_DELIVERY]: '待交付',
  [TASK_TYPES.IN_RENT]: '租赁中',
  [TASK_TYPES.PENDING_ACCEPTANCE]: '待验收',
  [TASK_TYPES.PENDING_REPAIR]: '待报修处理',
  [TASK_TYPES.AFTER_SALE]: '售后处理'
};

export const TASK_ICONS = {
  [TASK_TYPES.PENDING_DELIVERY]: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  [TASK_TYPES.IN_RENT]: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  [TASK_TYPES.PENDING_ACCEPTANCE]: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  [TASK_TYPES.PENDING_REPAIR]: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  [TASK_TYPES.AFTER_SALE]: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
  [TASK_TYPES.ALL]: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z'
};

export const TASK_COLORS = {
  [TASK_TYPES.ALL]: {
    primary: '#1890ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    light: 'rgba(24, 144, 255, 0.12)'
  },
  [TASK_TYPES.PENDING_DELIVERY]: {
    primary: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    light: 'rgba(102, 126, 234, 0.12)'
  },
  [TASK_TYPES.IN_RENT]: {
    primary: '#52c41a',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)',
    light: 'rgba(82, 196, 26, 0.12)'
  },
  [TASK_TYPES.PENDING_ACCEPTANCE]: {
    primary: '#fa8c16',
    gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
    light: 'rgba(250, 140, 22, 0.12)'
  },
  [TASK_TYPES.PENDING_REPAIR]: {
    primary: '#f5222d',
    gradient: 'linear-gradient(135deg, #f5222d 0%, #a8071a 100%)',
    light: 'rgba(245, 34, 45, 0.12)'
  },
  [TASK_TYPES.AFTER_SALE]: {
    primary: '#f5222d',
    gradient: 'linear-gradient(135deg, #f5222d 0%, #a8071a 100%)',
    light: 'rgba(245, 34, 45, 0.12)'
  }
};

export const STAT_CARDS = [
  { type: TASK_TYPES.PENDING_DELIVERY, label: TASK_LABELS[TASK_TYPES.PENDING_DELIVERY] },
  { type: TASK_TYPES.IN_RENT, label: TASK_LABELS[TASK_TYPES.IN_RENT] },
  { type: TASK_TYPES.PENDING_ACCEPTANCE, label: TASK_LABELS[TASK_TYPES.PENDING_ACCEPTANCE] },
  { type: TASK_TYPES.PENDING_REPAIR, label: TASK_LABELS[TASK_TYPES.PENDING_REPAIR] }
];

export const SHORTCUT_ITEMS = [
  { type: TASK_TYPES.ALL, label: TASK_LABELS[TASK_TYPES.ALL], statKey: 'todayTasks' },
  { type: TASK_TYPES.PENDING_DELIVERY, label: TASK_LABELS[TASK_TYPES.PENDING_DELIVERY], statKey: TASK_TYPES.PENDING_DELIVERY },
  { type: TASK_TYPES.IN_RENT, label: TASK_LABELS[TASK_TYPES.IN_RENT], statKey: TASK_TYPES.IN_RENT },
  { type: TASK_TYPES.PENDING_ACCEPTANCE, label: TASK_LABELS[TASK_TYPES.PENDING_ACCEPTANCE], statKey: TASK_TYPES.PENDING_ACCEPTANCE },
  { type: TASK_TYPES.AFTER_SALE, label: TASK_LABELS[TASK_TYPES.AFTER_SALE], statKey: TASK_TYPES.PENDING_REPAIR }
];

export const ENGINEER_LEVELS = {
  JUNIOR: 'junior',
  INTERMEDIATE: 'intermediate',
  SENIOR: 'senior'
};

export const ENGINEER_LEVEL_CONFIG = {
  [ENGINEER_LEVELS.JUNIOR]: {
    type: ENGINEER_LEVELS.JUNIOR,
    label: '初级工程师',
    minCount: 0,
    color: '#52c41a'
  },
  [ENGINEER_LEVELS.INTERMEDIATE]: {
    type: ENGINEER_LEVELS.INTERMEDIATE,
    label: '中级工程师',
    minCount: 30,
    color: '#1890ff'
  },
  [ENGINEER_LEVELS.SENIOR]: {
    type: ENGINEER_LEVELS.SENIOR,
    label: '高级工程师',
    minCount: 100,
    color: '#faad14'
  }
};

export const LEVEL_ORDER = {
  [ENGINEER_LEVELS.JUNIOR]: 1,
  [ENGINEER_LEVELS.INTERMEDIATE]: 2,
  [ENGINEER_LEVELS.SENIOR]: 3
};

export const PRIORITY_LABELS = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级'
};

export const API_ENDPOINTS = {
  EMPLOYEE_INFO: '/api/employee/info',
  DASHBOARD_STATS: '/api/dashboard/stats',
  LATEST_TASKS: '/api/dashboard/latest-tasks'
};
