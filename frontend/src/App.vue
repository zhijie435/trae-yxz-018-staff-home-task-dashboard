<template>
  <div class="home-page">
    <EmployeeHeader />
    <main class="main-content">
      <p class="placeholder">任务看板内容区域</p>
    </main>
  </div>
</template>

<script setup>
import EmployeeHeader from './components/EmployeeHeader.vue';
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  padding: 24px;
}

.placeholder {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 40px 0;
}
</style>
