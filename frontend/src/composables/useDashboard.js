import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import {
  TASK_LABELS,
  SHORTCUT_ITEMS,
  PRIORITY_LABELS,
  API_ENDPOINTS
} from '../constants/taskConfig';

export function useDashboard(emit) {
  const stats = ref({
    todayTasks: 0,
    pendingDelivery: 0,
    inRent: 0,
    pendingAcceptance: 0,
    pendingRepair: 0
  });

  const latestTasks = ref([]);

  const newTaskCount = computed(() => {
    return latestTasks.value.filter(task => task.status === 'new').length;
  });

  const shortcutCounts = computed(() => {
    return SHORTCUT_ITEMS.reduce((acc, item) => {
      acc[item.type] = stats.value[item.statKey] || 0;
      return acc;
    }, {});
  });

  const getTaskTypeLabel = (type) => {
    return TASK_LABELS[type] || type;
  };

  const getPriorityLabel = (priority) => {
    return PRIORITY_LABELS[priority] || priority;
  };

  const handleShortcutClick = (type) => {
    const label = TASK_LABELS[type] || type;
    console.log(`跳转到任务列表：${label}`);
    emit?.('navigate', { type, label });
  };

  const handleViewAllTasks = () => {
    console.log('查看全部任务');
    emit?.('navigate', { type: 'all', label: TASK_LABELS.all });
  };

  const handleViewTaskDetail = (task) => {
    console.log('查看任务详情:', task.title);
    emit?.('viewTask', task);
  };

  const handleContactCustomer = (task) => {
    console.log('联系客户:', task.customerName, task.customerPhone);
    emit?.('contactCustomer', task);
    if (task.customerPhone) {
      window.location.href = `tel:${task.customerPhone.replace(/\*/g, '0')}`;
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.DASHBOARD_STATS);
      if (response.data.code === 0) {
        stats.value = response.data.data;
      }
    } catch (error) {
      console.error('获取看板数据失败:', error);
    }
  };

  const fetchLatestTasks = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.LATEST_TASKS);
      if (response.data.code === 0) {
        latestTasks.value = response.data.data;
      }
    } catch (error) {
      console.error('获取最新任务失败:', error);
    }
  };

  const refreshDashboard = () => {
    fetchDashboardStats();
    fetchLatestTasks();
  };

  onMounted(() => {
    refreshDashboard();
  });

  return {
    stats,
    latestTasks,
    newTaskCount,
    shortcutCounts,
    getTaskTypeLabel,
    getPriorityLabel,
    handleShortcutClick,
    handleViewAllTasks,
    handleViewTaskDetail,
    handleContactCustomer,
    fetchDashboardStats,
    fetchLatestTasks,
    refreshDashboard
  };
}
