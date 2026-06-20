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
        <h1 class="employee-name">{{ employee.name || '加载中...' }}</h1>
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
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const employee = ref({
  id: '',
  name: '',
  avatar: '',
  city: ''
});

const initial = computed(() => {
  return employee.value.name ? employee.value.name.charAt(0) : '';
});

const fetchEmployeeInfo = async () => {
  try {
    const response = await axios.get('/api/employee/info');
    if (response.data.code === 0) {
      employee.value = response.data.data;
    }
  } catch (error) {
    console.error('获取员工信息失败:', error);
  }
};

onMounted(() => {
  fetchEmployeeInfo();
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
  gap: 8px;
}

.employee-name {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.employee-city {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.location-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 480px) {
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
}
</style>
