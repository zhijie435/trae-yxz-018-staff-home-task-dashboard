<template>
  <header class="employee-header">
    <div class="header-content">
      <div class="avatar-wrapper">
        <img
          v-if="employee.avatar"
          :src="employee.avatar"
          :alt="employee.name"
          class="avatar"
        />
        <div v-else class="avatar-placeholder">
          {{ initial }}
        </div>
      </div>
      <div class="info-wrapper">
        <div class="name-row">
          <h1 class="employee-name">{{ employee.name || '加载中...' }}</h1>
          <span
            class="level-badge"
            :class="'level-' + engineerLevel.type"
          >
            <svg
              class="badge-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
            {{ engineerLevel.label }}
          </span>
          <span
            v-if="showLevelUpBadge"
            class="level-up-badge"
          >
            <svg
              class="level-up-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"
                fill="currentColor"
              />
            </svg>
            恭喜升级！
          </span>
        </div>
        <div class="info-row">
          <div class="employee-id-badge">
            <svg
              class="id-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM10 10c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm6 5H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V15zm-2-5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"
                fill="currentColor"
              />
            </svg>
            <span class="id-label">工号</span>
            <span class="id-value">{{ employee.id || '--' }}</span>
          </div>
          <div class="employee-city">
            <svg
              class="location-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="currentColor"
              />
            </svg>
            <span>{{ employee.city || '--' }}</span>
          </div>
          <div class="delivery-info">
            <svg
              class="delivery-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                fill="currentColor"
              />
            </svg>
            <span>累计交付 {{ employee.deliveryCount || 0 }} 次</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onUnmounted } from 'vue';
import { useEmployee } from '../composables/useEmployee';

const {
  employee,
  initial,
  engineerLevel,
  showLevelUpBadge,
  cleanup
} = useEmployee();

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.employee-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 24px;
  color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.employee-name {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.badge-icon {
  width: 14px;
  height: 14px;
}

.level-junior {
  background: rgba(82, 196, 26, 0.2);
  color: #b7eb8f;
  border: 1px solid rgba(82, 196, 26, 0.4);
}

.level-intermediate {
  background: rgba(24, 144, 255, 0.2);
  color: #91d5ff;
  border: 1px solid rgba(24, 144, 255, 0.4);
}

.level-senior {
  background: rgba(250, 173, 20, 0.25);
  color: #ffe58f;
  border: 1px solid rgba(250, 173, 20, 0.5);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.employee-id-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 13px;
}

.id-icon {
  width: 14px;
  height: 14px;
  opacity: 0.9;
}

.id-label {
  opacity: 0.85;
  font-weight: 500;
}

.id-value {
  font-weight: 600;
  letter-spacing: 0.5px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.employee-city,
.delivery-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.location-icon,
.delivery-icon {
  width: 16px;
  height: 16px;
}

.level-up-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  background: linear-gradient(135deg, #ff7a45 0%, #fa541c 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(250, 84, 28, 0.4);
  animation: levelUpPulse 1.5s ease-in-out infinite;
}

.level-up-icon {
  width: 14px;
  height: 14px;
}

@keyframes levelUpPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(250, 84, 28, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(250, 84, 28, 0.6);
  }
}

@media (max-width: 640px) {
  .employee-header {
    padding: 24px 16px;
  }

  .header-content {
    gap: 16px;
  }

  .avatar,
  .avatar-placeholder {
    width: 64px;
    height: 64px;
  }

  .avatar-placeholder {
    font-size: 26px;
  }

  .employee-name {
    font-size: 20px;
  }

  .info-row {
    gap: 12px;
  }
}
</style>
