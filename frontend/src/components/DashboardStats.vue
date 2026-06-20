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
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['navigate']);

const stats = ref({
  todayTasks: 0,
  pendingDelivery: 0,
  inRent: 0,
  pendingAcceptance: 0,
  pendingRepair: 0
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

onMounted(() => {
  fetchDashboardStats();
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
</style>
