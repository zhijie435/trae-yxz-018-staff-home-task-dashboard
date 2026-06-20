<template>
  <svg
    class="task-icon"
    :class="className"
    :style="{ width: size + 'px', height: size + 'px' }"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path :d="iconPath" fill="currentColor" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';
import { TASK_ICONS, TASK_TYPES } from '../constants/taskConfig';

const props = defineProps({
  type: {
    type: String,
    default: TASK_TYPES.ALL
  },
  size: {
    type: Number,
    default: 24
  },
  className: {
    type: String,
    default: ''
  }
});

const iconPath = computed(() => {
  return TASK_ICONS[props.type] || TASK_ICONS[TASK_TYPES.ALL];
});
</script>

<style scoped>
.task-icon {
  flex-shrink: 0;
}
</style>
