<template>
  <section class="dashboard-section">
    <div class="dashboard-container">
      <div class="section-header">
        <h2 class="section-title">今日工作概览</h2>
        <div class="today-task-count">
          <span class="count-label">今日待完成</span>
          <span class="count-value">{{ stats.todayTasks || 0 }}</span>
          <span class="count-unit">项</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card card-purple">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">待交付</span>
            <span class="stat-value">{{ stats.pendingDelivery || 0 }}</span>
          </div>
        </div>

        <div class="stat-card card-green">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">租赁中</span>
            <span class="stat-value">{{ stats.inRent || 0 }}</span>
          </div>
        </div>

        <div class="stat-card card-orange">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">待验收</span>
            <span class="stat-value">{{ stats.pendingAcceptance || 0 }}</span>
          </div>
        </div>

        <div class="stat-card card-red">
          <div class="stat-icon-wrapper">
            <svg class="stat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">待报修处理</span>
            <span class="stat-value">{{ stats.pendingRepair || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="shortcut-section">
        <div class="shortcut-header">
          <h3 class="shortcut-title">快捷任务入口</h3>
        </div>
        <div class="shortcut-grid">
          <div class="shortcut-item shortcut-all" @click="handleShortcutClick('all')">
            <div class="shortcut-icon-wrapper icon-blue">
              <svg class="shortcut-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/>
              </svg>
            </div>
            <div class="shortcut-info">
              <span class="shortcut-label">全部任务</span>
              <span class="shortcut-count">{{ shortcutCounts.all || 0 }} 项</span>
            </div>
            <svg class="shortcut-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
            </svg>
          </div>

          <div class="shortcut-item shortcut-delivery" @click="handleShortcutClick('pendingDelivery')">
            <div class="shortcut-icon-wrapper icon-purple">
              <svg class="shortcut-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
              </svg>
            </div>
            <div class="shortcut-info">
              <span class="shortcut-label">待交付</span>
              <span class="shortcut-count">{{ shortcutCounts.pendingDelivery || 0 }} 项</span>
            </div>
            <svg class="shortcut-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
            </svg>
          </div>

          <div class="shortcut-item shortcut-rent" @click="handleShortcutClick('inRent')">
            <div class="shortcut-icon-wrapper icon-green">
              <svg class="shortcut-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <div class="shortcut-info">
              <span class="shortcut-label">租赁中</span>
              <span class="shortcut-count">{{ shortcutCounts.inRent || 0 }} 项</span>
            </div>
            <svg class="shortcut-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
            </svg>
          </div>

          <div class="shortcut-item shortcut-acceptance" @click="handleShortcutClick('pendingAcceptance')">
            <div class="shortcut-icon-wrapper icon-orange">
              <svg class="shortcut-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
              </svg>
            </div>
            <div class="shortcut-info">
              <span class="shortcut-label">待验收</span>
              <span class="shortcut-count">{{ shortcutCounts.pendingAcceptance || 0 }} 项</span>
            </div>
            <svg class="shortcut-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
            </svg>
          </div>

          <div class="shortcut-item shortcut-aftersale" @click="handleShortcutClick('afterSale')">
            <div class="shortcut-icon-wrapper icon-red">
              <svg class="shortcut-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
              </svg>
            </div>
            <div class="shortcut-info">
              <span class="shortcut-label">售后处理</span>
              <span class="shortcut-count">{{ shortcutCounts.afterSale || 0 }} 项</span>
            </div>
            <svg class="shortcut-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="latest-tasks-section">
        <div class="latest-tasks-header">
          <div class="header-left">
            <h3 class="latest-tasks-title">最新任务提醒</h3>
            <span class="new-badge" v-if="newTaskCount > 0">{{ newTaskCount }}条新任务</span>
          </div>
          <div class="header-right">
            <span class="view-all" @click="handleViewAllTasks">
              查看全部
              <svg class="view-all-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
              </svg>
            </span>
          </div>
        </div>

        <div class="latest-tasks-list">
          <div
            v-for="task in latestTasks"
            :key="task.id"
            class="task-card"
            :class="'task-type-' + task.type"
          >
            <div class="task-card-header">
              <div class="task-type-tag">
                <svg class="task-type-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path v-if="task.type === 'pendingDelivery'" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
                  <path v-else-if="task.type === 'inRent'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  <path v-else-if="task.type === 'pendingAcceptance'" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
                  <path v-else d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/>
                </svg>
                {{ task.typeLabel }}
              </div>
              <div class="task-time">
                <svg class="time-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
                </svg>
                {{ task.relativeTime }}
              </div>
            </div>

            <div class="task-card-body">
              <h4 class="task-title">{{ task.title }}</h4>
              <div class="task-customer">
                <div class="customer-info">
                  <svg class="customer-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                  </svg>
                  <span class="customer-name">{{ task.customerName }}</span>
                  <span class="customer-phone">{{ task.customerPhone }}</span>
                </div>
                <div class="task-priority" :class="'priority-' + task.priority">
                  {{ task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级' }}
                </div>
              </div>
              <div class="task-address">
                <svg class="address-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                <span>{{ task.address }}</span>
              </div>
              <div class="task-remark" v-if="task.remark">
                <svg class="remark-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
                </svg>
                <span>{{ task.remark }}</span>
              </div>
            </div>

            <div class="task-card-footer">
              <button class="action-btn btn-contact" @click.stop="handleContactCustomer(task)">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                </svg>
                联系用户
              </button>
              <button class="action-btn btn-detail" @click.stop="handleViewTaskDetail(task)">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                </svg>
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['navigate', 'viewTask', 'contactCustomer']);

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

const shortcutCounts = computed(() => ({
  all: (stats.value.pendingDelivery || 0) + (stats.value.inRent || 0) + (stats.value.pendingAcceptance || 0) + (stats.value.pendingRepair || 0),
  pendingDelivery: stats.value.pendingDelivery || 0,
  inRent: stats.value.inRent || 0,
  pendingAcceptance: stats.value.pendingAcceptance || 0,
  afterSale: stats.value.pendingRepair || 0
}));

const handleShortcutClick = (type) => {
  const typeMap = {
    all: '全部任务',
    pendingDelivery: '待交付',
    inRent: '租赁中',
    pendingAcceptance: '待验收',
    afterSale: '售后处理'
  };
  console.log(`跳转到任务列表：${typeMap[type] || type}`);
  emit('navigate', { type, label: typeMap[type] });
};

const handleViewAllTasks = () => {
  console.log('查看全部任务');
  emit('navigate', { type: 'all', label: '全部任务' });
};

const handleViewTaskDetail = (task) => {
  console.log('查看任务详情:', task.title);
  emit('viewTask', task);
};

const handleContactCustomer = (task) => {
  console.log('联系客户:', task.customerName, task.customerPhone);
  emit('contactCustomer', task);
  if (task.customerPhone) {
    window.location.href = `tel:${task.customerPhone.replace(/\*/g, '0')}`;
  }
};

const fetchDashboardStats = async () => {
  try {
    const response = await axios.get('/api/dashboard/stats');
    if (response.data.code === 0) {
      stats.value = response.data.data;
    }
  } catch (error) {
    console.error('获取看板数据失败:', error);
  }
};

const fetchLatestTasks = async () => {
  try {
    const response = await axios.get('/api/dashboard/latest-tasks');
    if (response.data.code === 0) {
      latestTasks.value = response.data.data;
    }
  } catch (error) {
    console.error('获取最新任务失败:', error);
  }
};

onMounted(() => {
  fetchDashboardStats();
  fetchLatestTasks();
});
</script>

<style scoped>
.dashboard-section {
  margin-top: -20px;
  padding: 0 24px 24px;
  position: relative;
  z-index: 2;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.today-task-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.count-label {
  font-size: 14px;
  color: #909399;
}

.count-value {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.count-unit {
  font-size: 14px;
  color: #909399;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  min-width: 0;
}

.card-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-green {
  background: linear-gradient(135deg, #52c41a 0%, #237804 100%);
}

.card-orange {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
}

.card-red {
  background: linear-gradient(135deg, #f5222d 0%, #a8071a 100%);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 28px;
  height: 28px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard-section {
    padding: 0 16px 16px;
  }

  .dashboard-container {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .count-value {
    font-size: 24px;
  }

  .stat-value {
    font-size: 24px;
  }
}

.shortcut-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.shortcut-header {
  margin-bottom: 16px;
}

.shortcut-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fafbfc;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.shortcut-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 3px 0 0 3px;
}

.shortcut-all::before {
  background: linear-gradient(180deg, #1890ff 0%, #096dd9 100%);
}

.shortcut-delivery::before {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.shortcut-rent::before {
  background: linear-gradient(180deg, #52c41a 0%, #237804 100%);
}

.shortcut-acceptance::before {
  background: linear-gradient(180deg, #fa8c16 0%, #d46b08 100%);
}

.shortcut-aftersale::before {
  background: linear-gradient(180deg, #f5222d 0%, #a8071a 100%);
}

.shortcut-item:hover {
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.shortcut-all:hover {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
}

.shortcut-delivery:hover {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.shortcut-rent:hover {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
}

.shortcut-acceptance:hover {
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
}

.shortcut-aftersale:hover {
  background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
}

.shortcut-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-blue {
  background: rgba(24, 144, 255, 0.12);
  color: #1890ff;
}

.icon-purple {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
}

.icon-green {
  background: rgba(82, 196, 26, 0.12);
  color: #52c41a;
}

.icon-orange {
  background: rgba(250, 140, 22, 0.12);
  color: #fa8c16;
}

.icon-red {
  background: rgba(245, 34, 45, 0.12);
  color: #f5222d;
}

.shortcut-icon {
  width: 22px;
  height: 22px;
}

.shortcut-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.shortcut-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  line-height: 1.4;
}

.shortcut-count {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.shortcut-arrow {
  width: 16px;
  height: 16px;
  color: #c0c4cc;
  flex-shrink: 0;
  transition: color 0.2s ease, transform 0.2s ease;
}

.shortcut-item:hover .shortcut-arrow {
  color: #606266;
  transform: translateX(2px);
}

@media (max-width: 1024px) {
  .shortcut-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .shortcut-section {
    margin-top: 20px;
    padding-top: 20px;
  }

  .shortcut-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .shortcut-item {
    padding: 12px;
    gap: 10px;
  }

  .shortcut-icon-wrapper {
    width: 36px;
    height: 36px;
  }

  .shortcut-icon {
    width: 20px;
    height: 20px;
  }
}

.latest-tasks-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.latest-tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.latest-tasks-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.new-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  background: linear-gradient(135deg, #f5222d 0%, #a8071a 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.view-all {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  color: #667eea;
  cursor: pointer;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: #764ba2;
}

.view-all-icon {
  width: 16px;
  height: 16px;
}

.latest-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.task-type-pendingDelivery::before {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.task-type-inRent::before {
  background: linear-gradient(180deg, #52c41a 0%, #237804 100%);
}

.task-type-pendingAcceptance::before {
  background: linear-gradient(180deg, #fa8c16 0%, #d46b08 100%);
}

.task-type-pendingRepair::before {
  background: linear-gradient(180deg, #f5222d 0%, #a8071a 100%);
}

.task-card:hover {
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-type-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.task-type-pendingDelivery .task-type-tag {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
}

.task-type-inRent .task-type-tag {
  background: rgba(82, 196, 26, 0.12);
  color: #52c41a;
}

.task-type-pendingAcceptance .task-type-tag {
  background: rgba(250, 140, 22, 0.12);
  color: #fa8c16;
}

.task-type-pendingRepair .task-type-tag {
  background: rgba(245, 34, 45, 0.12);
  color: #f5222d;
}

.task-type-icon {
  width: 14px;
  height: 14px;
}

.task-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.time-icon {
  width: 14px;
  height: 14px;
}

.task-card-body {
  margin-bottom: 14px;
}

.task-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.task-customer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.customer-icon {
  width: 14px;
  height: 14px;
  color: #909399;
}

.customer-name {
  font-weight: 500;
  color: #303133;
}

.customer-phone {
  color: #909399;
}

.task-priority {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.priority-high {
  background: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

.priority-medium {
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.priority-low {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.task-address {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.address-icon {
  width: 14px;
  height: 14px;
  color: #909399;
  flex-shrink: 0;
  margin-top: 1px;
}

.task-address span {
  line-height: 1.4;
}

.task-remark {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 8px 10px;
  border-radius: 6px;
  margin-top: 8px;
}

.remark-icon {
  width: 14px;
  height: 14px;
  color: #c0c4cc;
  flex-shrink: 0;
  margin-top: 1px;
}

.task-remark span {
  line-height: 1.5;
}

.task-card-footer {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-contact {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.btn-contact:hover {
  background: #52c41a;
  color: #ffffff;
}

.btn-detail {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.btn-detail:hover {
  background: #667eea;
  color: #ffffff;
}

@media (max-width: 640px) {
  .latest-tasks-section {
    margin-top: 20px;
    padding-top: 20px;
  }

  .task-card {
    padding: 14px;
  }

  .task-title {
    font-size: 14px;
  }

  .task-customer {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .task-card-footer {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
