import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, onUnmounted, onMounted } from 'vue';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { useEmployee } from '../src/composables/useEmployee';
import {
  ENGINEER_LEVEL_CONFIG,
  LEVEL_ORDER,
  API_ENDPOINTS
} from '../src/constants/taskConfig';

const mock = new MockAdapter(axios);

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

function createHostComponent(setupFn) {
  return defineComponent({
    setup() {
      const ctx = setupFn();
      return ctx;
    },
    template: '<div></div>'
  });
}

function setupEmployeeMock(response) {
  mock.reset();
  mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, response);
}

describe('useEmployee Composable - 员工编号 (Employee ID)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('应正确显示从后端获取的员工编号', async () => {
    setupEmployeeMock({
      code: 0,
      data: {
        id: 'CGRE00001',
        name: '张明华',
        avatar: '',
        city: '上海',
        deliveryCount: 50,
        level: { type: 'intermediate', label: '中级工程师' }
      }
    });

    const wrapper = mount(defineComponent({
      setup() {
        const ctx = useEmployee();
        return ctx;
      },
      template: '<div></div>'
    }));

    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.employee.id).toBe('CGRE00001');
    wrapper.unmount();
  });

  it('员工编号格式应为 CGRE + 5位数字', async () => {
    const testIds = ['CGRE00001', 'CGRE00042', 'CGRE00100', 'CGRE99999'];
    for (const id of testIds) {
      setupEmployeeMock({
        code: 0,
        data: {
          id,
          name: '测试员工',
          avatar: '',
          city: '北京',
          deliveryCount: 10,
          level: null
        }
      });

      const wrapper = mount(defineComponent({
        setup() {
          return useEmployee();
        },
        template: '<div></div>'
      }));
      await flushPromises();
      await nextTick();
      await flushPromises();
      await nextTick();

      expect(wrapper.vm.employee.id).toMatch(/^CGRE\d{5}$/);
      wrapper.unmount();
    }
  });

  it('员工编号初始值应为空字符串', () => {
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(() => new Promise(() => {}));

    let capturedId;
    const wrapper = mount(defineComponent({
      setup() {
        const emp = useEmployee();
        capturedId = emp.employee.value.id;
        onMounted(() => {
          emp.fetchEmployeeInfo();
        });
        return { emp };
      },
      template: '<div></div>'
    }));
    expect(capturedId).toBe('');
    wrapper.unmount();
  });

  it('获取员工信息失败时，应保持默认空值', async () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).networkError();

    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.employee.id).toBe('');
    expect(wrapper.vm.employee.name).toBe('');
    wrapper.unmount();
  });
});

describe('useEmployee Composable - 等级计算 (Level Calculation)', () => {
  beforeEach(() => {
    mock.reset();
  });

  async function runLevelTest(mockResponse, expected) {
    mock.reset();
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, mockResponse);

    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));

    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.engineerLevel.type).toBe(expected.type);
    expect(wrapper.vm.engineerLevel.label).toBe(expected.label);
    wrapper.unmount();
  }

  it('当员工 level 对象完整时，应直接使用员工 level', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001',
          name: '测试员工',
          avatar: '',
          city: '北京',
          deliveryCount: 0,
          level: { type: 'senior', label: '高级工程师' }
        }
      },
      { type: 'senior', label: '高级工程师' }
    )
  );

  it('deliveryCount 0 应根据交付次数回退计算为初级', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001', name: '测试', avatar: '', city: '北京',
          deliveryCount: 0, level: null
        }
      },
      ENGINEER_LEVEL_CONFIG.junior
    )
  );

  it('deliveryCount 29 应根据交付次数计算为初级（边界）', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001', name: '测试', avatar: '', city: '北京',
          deliveryCount: 29, level: null
        }
      },
      ENGINEER_LEVEL_CONFIG.junior
    )
  );

  it('deliveryCount 30 应根据交付次数计算为中级（边界）', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001', name: '测试', avatar: '', city: '北京',
          deliveryCount: 30, level: null
        }
      },
      ENGINEER_LEVEL_CONFIG.intermediate
    )
  );

  it('deliveryCount 50 应根据交付次数计算为中级', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001', name: '测试', avatar: '', city: '北京',
          deliveryCount: 50, level: null
        }
      },
      ENGINEER_LEVEL_CONFIG.intermediate
    )
  );

  it('deliveryCount 99 应根据交付次数计算为中级（边界）', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001', name: '测试', avatar: '', city: '北京',
          deliveryCount: 99, level: null
        }
      },
      ENGINEER_LEVEL_CONFIG.intermediate
    )
  );

  it('deliveryCount 100 应根据交付次数计算为高级（边界）', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001', name: '测试', avatar: '', city: '北京',
          deliveryCount: 100, level: null
        }
      },
      ENGINEER_LEVEL_CONFIG.senior
    )
  );

  it('deliveryCount 500 应根据交付次数计算为高级', () =>
    runLevelTest(
      {
        code: 0,
        data: {
          id: 'CGRE00001', name: '测试', avatar: '', city: '北京',
          deliveryCount: 500, level: null
        }
      },
      ENGINEER_LEVEL_CONFIG.senior
    )
  );

  it('应正确显示等级颜色和配置', async () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, {
      code: 0,
      data: {
        id: 'CGRE00001', name: '测试', avatar: '', city: '上海',
        deliveryCount: 100, level: null
      }
    });

    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    const level = wrapper.vm.engineerLevel;
    expect(level.minCount).toBeDefined();
    expect(level.color).toBeDefined();
    wrapper.unmount();
  });
});

describe('useEmployee Composable - 姓名首字母 (Initial)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('应正确提取中文姓名的第一个字', async () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, {
      code: 0,
      data: {
        id: 'CGRE00001', name: '张明华', avatar: '', city: '上海',
        deliveryCount: 50, level: null
      }
    });
    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.initial).toBe('张');
    wrapper.unmount();
  });

  it('无姓名时，应返回空字符串', async () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, {
      code: 0,
      data: {
        id: 'CGRE00001', name: '', avatar: '', city: '北京',
        deliveryCount: 10, level: null
      }
    });
    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.initial).toBe('');
    wrapper.unmount();
  });
});

describe('useEmployee Composable - 升级提醒 (Level Up Badge)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('初始状态下不应显示升级徽章', async () => {
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, {
      code: 0,
      data: {
        id: 'CGRE00001', name: '测试员工', avatar: '', city: '北京',
        deliveryCount: 10, level: { type: 'junior', label: '初级工程师' }
      }
    });
    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.showLevelUpBadge).toBe(false);
    wrapper.unmount();
  });

  it('LEVEL_ORDER 应定义正确的等级顺序', () => {
    expect(LEVEL_ORDER.junior).toBe(1);
    expect(LEVEL_ORDER.intermediate).toBe(2);
    expect(LEVEL_ORDER.senior).toBe(3);
    expect(LEVEL_ORDER.senior).toBeGreaterThan(LEVEL_ORDER.intermediate);
    expect(LEVEL_ORDER.intermediate).toBeGreaterThan(LEVEL_ORDER.junior);
  });

  it('cleanup 应能正常调用', async () => {
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, {
      code: 0,
      data: {
        id: 'CGRE00001', name: '测试员工', avatar: '', city: '北京',
        deliveryCount: 10, level: { type: 'junior', label: '初级工程师' }
      }
    });
    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(() => wrapper.vm.cleanup()).not.toThrow();
    wrapper.unmount();
  });
});

describe('useEmployee Composable - fetchEmployeeInfo', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('当 API 返回 code !== 0 时，不应更新 employee 数据', async () => {
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, {
      code: 500,
      message: 'error',
      data: null
    });
    const wrapper = mount(defineComponent({
      setup() { return useEmployee(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.employee.id).toBe('');
    expect(wrapper.vm.employee.name).toBe('');
    expect(wrapper.vm.employee.deliveryCount).toBe(0);
    wrapper.unmount();
  });

  it('fetchEmployeeInfo 应返回 Promise', () => {
    mock.onGet(API_ENDPOINTS.EMPLOYEE_INFO).reply(200, { code: 0, data: null });
    const wrapper = mount(defineComponent({
      setup() { return { emp: useEmployee() }; },
      template: '<div></div>'
    }));
    const result = wrapper.vm.emp.fetchEmployeeInfo();
    expect(result).toBeInstanceOf(Promise);
    wrapper.unmount();
  });
});
