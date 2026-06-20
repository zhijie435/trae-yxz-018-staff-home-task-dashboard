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
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
  todayTasks: 0,
  pendingDelivery: 0,
  inRent: 0,
  pendingAcceptance: 0,
  pendingRepair: 0
});

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
</style>
