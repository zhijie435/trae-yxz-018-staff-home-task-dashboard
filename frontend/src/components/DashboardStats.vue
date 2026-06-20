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
        <div
          v-for="card in statCards"
          :key="card.type"
          class="stat-card"
          :class="'card-' + card.type"
          @click="handleShortcutClick(card.type)"
        >
          <div class="stat-icon-wrapper">
            <TaskIcon :type="card.type" :size="28" />
          </div>
          <div class="stat-content">
            <span class="stat-label">{{ card.label }}</span>
            <span class="stat-value">{{ stats[card.type] || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="shortcut-section">
        <div class="shortcut-header">
          <h3 class="shortcut-title">快捷任务入口</h3>
        </div>
        <div class="shortcut-grid">
          <div
            v-for="item in shortcutItems"
            :key="item.type"
            class="shortcut-item"
            :class="'shortcut-' + item.type"
            @click="handleShortcutClick(item.type)"
          >
            <div class="shortcut-icon-wrapper" :class="'icon-' + item.type">
              <TaskIcon :type="item.type" :size="22" />
            </div>
            <div class="shortcut-info">
              <span class="shortcut-label">{{ item.label }}</span>
              <span class="shortcut-count">{{ shortcutCounts[item.type] || 0 }} 项</span>
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
                <TaskIcon :type="task.type" :size="14" class-name="task-type-icon" />
                {{ getTaskTypeLabel(task.type) }}
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
                  {{ getPriorityLabel(task.priority) }}
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
import TaskIcon from './TaskIcon.vue';
import { useDashboard } from '../composables/useDashboard';
import { STAT_CARDS, SHORTCUT_ITEMS } from '../constants/taskConfig';

const emit = defineEmits(['navigate', 'viewTask', 'contactCustomer']);

const statCards = STAT_CARDS;
const shortcutItems = SHORTCUT_ITEMS;

const {
  stats,
  latestTasks,
  newTaskCount,
  shortcutCounts,
  getTaskTypeLabel,
  getPriorityLabel,
  handleShortcutClick,
  handleViewAllTasks,
  handleViewTaskDetail,
  handleContactCustomer
} = useDashboard(emit);
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

.card-pendingDelivery {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-inRent {
  background: linear-gradient(135deg, #52c41a 0%, #237804 100%);
}

.card-pendingAcceptance {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
}

.card-pendingRepair {
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

.shortcut-pendingDelivery::before {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.shortcut-inRent::before {
  background: linear-gradient(180deg, #52c41a 0%, #237804 100%);
}

.shortcut-pendingAcceptance::before {
  background: linear-gradient(180deg, #fa8c16 0%, #d46b08 100%);
}

.shortcut-afterSale::before {
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

.shortcut-pendingDelivery:hover {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.shortcut-inRent:hover {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
}

.shortcut-pendingAcceptance:hover {
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
}

.shortcut-afterSale:hover {
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

.icon-all {
  background: rgba(24, 144, 255, 0.12);
  color: #1890ff;
}

.icon-pendingDelivery {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
}

.icon-inRent {
  background: rgba(82, 196, 26, 0.12);
  color: #52c41a;
}

.icon-pendingAcceptance {
  background: rgba(250, 140, 22, 0.12);
  color: #fa8c16;
}

.icon-afterSale {
  background: rgba(245, 34, 45, 0.12);
  color: #f5222d;
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

.task-type-afterSale::before {
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

.task-type-pendingRepair .task-type-tag,
.task-type-afterSale .task-type-tag {
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
