import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import {
  ENGINEER_LEVEL_CONFIG,
  LEVEL_ORDER,
  API_ENDPOINTS
} from '../constants/taskConfig';

export function useEmployee() {
  const employee = ref({
    id: '',
    name: '',
    avatar: '',
    city: '',
    deliveryCount: 0,
    level: null
  });

  const previousLevelType = ref(null);
  const showLevelUpBadge = ref(false);
  let levelUpTimer = null;

  const initial = computed(() => {
    return employee.value.name ? employee.value.name.charAt(0) : '';
  });

  const engineerLevel = computed(() => {
    if (employee.value.level?.type && employee.value.level?.label) {
      return employee.value.level;
    }
    const count = employee.value.deliveryCount || 0;
    const levels = Object.values(ENGINEER_LEVEL_CONFIG).sort((a, b) => b.minCount - a.minCount);
    return levels.find(level => count >= level.minCount) || ENGINEER_LEVEL_CONFIG.junior;
  });

  const currentLevelType = computed(() => {
    return employee.value.level?.type || engineerLevel.value.type;
  });

  const checkLevelUp = (newLevel, oldLevel) => {
    if (oldLevel && newLevel && LEVEL_ORDER[newLevel] > LEVEL_ORDER[oldLevel]) {
      showLevelUpBadge.value = true;
      if (levelUpTimer) clearTimeout(levelUpTimer);
      levelUpTimer = setTimeout(() => {
        showLevelUpBadge.value = false;
      }, 5000);
    }
  };

  watch(
    currentLevelType,
    (newType, oldType) => {
      if (previousLevelType.value && previousLevelType.value !== newType) {
        checkLevelUp(newType, previousLevelType.value);
      }
      previousLevelType.value = newType;
    }
  );

  const fetchEmployeeInfo = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.EMPLOYEE_INFO);
      if (response.data.code === 0) {
        employee.value = response.data.data;
      }
    } catch (error) {
      console.error('获取员工信息失败:', error);
    }
  };

  const cleanup = () => {
    if (levelUpTimer) {
      clearTimeout(levelUpTimer);
    }
  };

  onMounted(() => {
    fetchEmployeeInfo();
  });

  return {
    employee,
    initial,
    engineerLevel,
    showLevelUpBadge,
    fetchEmployeeInfo,
    cleanup
  };
}
