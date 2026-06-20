import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, onMounted } from 'vue';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { useDashboard } from '../src/composables/useDashboard';
import {
  TASK_LABELS,
  SHORTCUT_ITEMS,
  PRIORITY_LABELS,
  API_ENDPOINTS
} from '../src/constants/taskConfig';

const mock = new MockAdapter(axios);

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

const mockStatsData = {
  todayTasks: 60,
  pendingDelivery: 12,
  inRent: 38,
  pendingAcceptance: 7,
  pendingRepair: 3
};

const mockLatestTasks = [
  {
    id: 'TASK20240620001',
    title: '上海市浦东新区XX小区设备交付',
    type: 'pendingDelivery',
    typeLabel: '待交付',
    customerName: '李先生',
    customerPhone: '138****5678',
    address: '上海市浦东新区张江高科技园区博云路2号',
    assignTime: '2024-06-20 09:30:00',
    relativeTime: '10分钟前',
    status: 'new',
    priority: 'high',
    remark: '请在今天下午3点前送达'
  },
  {
    id: 'TASK20240620002',
    title: '徐汇区商务楼设备验收',
    type: 'pendingAcceptance',
    typeLabel: '待验收',
    customerName: '王经理',
    customerPhone: '139****1234',
    address: '上海市徐汇区淮海中路168号',
    assignTime: '2024-06-20 08:45:00',
    relativeTime: '55分钟前',
    status: 'new',
    priority: 'medium',
    remark: '需要携带验收单据和工具'
  },
  {
    id: 'TASK20240619003',
    title: '闵行区租赁设备维护检查',
    type: 'inRent',
    typeLabel: '租赁中',
    customerName: '张女士',
    customerPhone: '137****9876',
    address: '上海市闵行区莘庄工业区申富路668号',
    assignTime: '2024-06-19 16:20:00',
    relativeTime: '昨天 16:20',
    status: 'processing',
    priority: 'low',
    remark: '月度例行维护，请提前联系客户'
  }
];

function setupDashboardMock(stats = mockStatsData, tasks = mockLatestTasks) {
  mock.reset();
  mock.onGet(API_ENDPOINTS.DASHBOARD_STATS).reply(200, {
    code: 0, message: 'success', data: stats
  });
  mock.onGet(API_ENDPOINTS.LATEST_TASKS).reply(200, {
    code: 0, message: 'success', data: tasks
  });
}

async function mountDashboard(emit = vi.fn(), setupMock = true) {
  if (setupMock) setupDashboardMock();
  const wrapper = mount(defineComponent({
    setup() { return useDashboard(emit); },
    template: '<div></div>'
  }));
  await flushPromises();
  await nextTick();
  await flushPromises();
  await nextTick();
  return wrapper;
}

describe('useDashboard Composable - 待完成数量统计 (Stats)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('应正确获取默认待完成统计数据', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.stats.todayTasks).toBe(mockStatsData.todayTasks);
    expect(wrapper.vm.stats.pendingDelivery).toBe(mockStatsData.pendingDelivery);
    expect(wrapper.vm.stats.inRent).toBe(mockStatsData.inRent);
    expect(wrapper.vm.stats.pendingAcceptance).toBe(mockStatsData.pendingAcceptance);
    expect(wrapper.vm.stats.pendingRepair).toBe(mockStatsData.pendingRepair);
    wrapper.unmount();
  });

  it('今日待完成数量应为各类型之和', async () => {
    const wrapper = await mountDashboard();
    const { stats } = wrapper.vm;
    const expectedTotal =
      stats.pendingDelivery +
      stats.inRent +
      stats.pendingAcceptance +
      stats.pendingRepair;
    expect(stats.todayTasks).toBe(expectedTotal);
    wrapper.unmount();
  });

  it('初始 stats 所有字段应为 0', () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.DASHBOARD_STATS).reply(() => new Promise(() => {}));
    mock.onGet(API_ENDPOINTS.LATEST_TASKS).reply(() => new Promise(() => {}));

    let initialStats;
    const wrapper = mount(defineComponent({
      setup() {
        const dash = useDashboard();
        initialStats = { ...dash.stats.value };
        onMounted(() => { dash.refreshDashboard(); });
        return { dash };
      },
      template: '<div></div>'
    }));
    expect(initialStats.todayTasks).toBe(0);
    expect(initialStats.pendingDelivery).toBe(0);
    expect(initialStats.inRent).toBe(0);
    expect(initialStats.pendingAcceptance).toBe(0);
    expect(initialStats.pendingRepair).toBe(0);
    wrapper.unmount();
  });

  it('当 API 返回 code !== 0 时，应保持默认值 0', async () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.DASHBOARD_STATS).reply(200, { code: 500, data: null });
    mock.onGet(API_ENDPOINTS.LATEST_TASKS).reply(200, { code: 0, data: [] });

    const wrapper = await mountDashboard(vi.fn(), false);
    expect(wrapper.vm.stats.todayTasks).toBe(0);
    expect(wrapper.vm.stats.pendingDelivery).toBe(0);
    wrapper.unmount();
  });

  it('当 API 网络错误时，应保持默认值 0', async () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.DASHBOARD_STATS).networkError();
    mock.onGet(API_ENDPOINTS.LATEST_TASKS).networkError();

    const wrapper = await mountDashboard(vi.fn(), false);
    expect(wrapper.vm.stats.todayTasks).toBe(0);
    wrapper.unmount();
  });

  it('refreshDashboard 应刷新 stats 数据', async () => {
    mock.reset();
    let statsCallCount = 0;
    const firstStats = { todayTasks: 5, pendingDelivery: 1, inRent: 1, pendingAcceptance: 1, pendingRepair: 2 };
    const secondStats = { todayTasks: 10, pendingDelivery: 2, inRent: 2, pendingAcceptance: 3, pendingRepair: 3 };

    mock.onGet(API_ENDPOINTS.DASHBOARD_STATS).reply(() => {
      statsCallCount++;
      return [200, { code: 0, data: statsCallCount === 1 ? firstStats : secondStats }];
    });
    mock.onGet(API_ENDPOINTS.LATEST_TASKS).reply(200, { code: 0, data: [] });

    const wrapper = mount(defineComponent({
      setup() { return useDashboard(); },
      template: '<div></div>'
    }));
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.stats.todayTasks).toBe(5);
    await wrapper.vm.refreshDashboard();
    await flushPromises();
    await nextTick();

    expect(wrapper.vm.stats.todayTasks).toBe(10);
    wrapper.unmount();
  });
});

describe('useDashboard Composable - 快捷入口数量 (Shortcut Counts)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('shortcutCounts 应基于 SHORTCUT_ITEMS 和 stats 计算得出', async () => {
    const wrapper = await mountDashboard();
    const { shortcutCounts, stats } = wrapper.vm;
    SHORTCUT_ITEMS.forEach(item => {
      expect(shortcutCounts).toHaveProperty(item.type);
      expect(shortcutCounts[item.type]).toBe(stats[item.statKey] || 0);
    });
    wrapper.unmount();
  });

  it('快捷入口 all 应使用 todayTasks 数量', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.shortcutCounts.all).toBe(mockStatsData.todayTasks);
    wrapper.unmount();
  });

  it('快捷入口 pendingDelivery 应对应正确数量', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.shortcutCounts.pendingDelivery).toBe(mockStatsData.pendingDelivery);
    wrapper.unmount();
  });

  it('快捷入口 inRent 应对应正确数量', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.shortcutCounts.inRent).toBe(mockStatsData.inRent);
    wrapper.unmount();
  });

  it('快捷入口 pendingAcceptance 应对应正确数量', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.shortcutCounts.pendingAcceptance).toBe(mockStatsData.pendingAcceptance);
    wrapper.unmount();
  });

  it('快捷入口 afterSale 应使用 pendingRepair 数量', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.shortcutCounts.afterSale).toBe(mockStatsData.pendingRepair);
    wrapper.unmount();
  });
});

describe('useDashboard Composable - 最新任务提醒 (Latest Tasks)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('应获取最新任务列表数据', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.latestTasks).toHaveLength(mockLatestTasks.length);
    expect(wrapper.vm.latestTasks[0].id).toBe(mockLatestTasks[0].id);
    wrapper.unmount();
  });

  it('初始 latestTasks 应为空数组', () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.DASHBOARD_STATS).reply(() => new Promise(() => {}));
    mock.onGet(API_ENDPOINTS.LATEST_TASKS).reply(() => new Promise(() => {}));

    let initialTasks;
    const wrapper = mount(defineComponent({
      setup() {
        const dash = useDashboard();
        initialTasks = [...dash.latestTasks.value];
        onMounted(() => { dash.refreshDashboard(); });
        return { dash };
      },
      template: '<div></div>'
    }));
    expect(initialTasks).toEqual([]);
    wrapper.unmount();
  });

  it('newTaskCount 应统计状态为 new 的任务数', async () => {
    const wrapper = await mountDashboard();
    const expectedNew = mockLatestTasks.filter(t => t.status === 'new').length;
    expect(wrapper.vm.newTaskCount).toBe(expectedNew);
    expect(wrapper.vm.newTaskCount).toBe(2);
    wrapper.unmount();
  });

  it('当没有新任务时 newTaskCount 应为 0', async () => {
    setupDashboardMock(mockStatsData, [
      { ...mockLatestTasks[0], status: 'processing' },
      { ...mockLatestTasks[1], status: 'completed' }
    ]);
    const wrapper = await mountDashboard(vi.fn(), false);
    expect(wrapper.vm.newTaskCount).toBe(0);
    wrapper.unmount();
  });

  it('当 latestTasks 为空时 newTaskCount 应为 0', async () => {
    setupDashboardMock(mockStatsData, []);
    const wrapper = await mountDashboard(vi.fn(), false);
    expect(wrapper.vm.latestTasks).toEqual([]);
    expect(wrapper.vm.newTaskCount).toBe(0);
    wrapper.unmount();
  });

  it('当 API 返回 code !== 0 时 latestTasks 保持空', async () => {
    mock.reset();
    mock.onGet(API_ENDPOINTS.DASHBOARD_STATS).reply(200, { code: 0, data: mockStatsData });
    mock.onGet(API_ENDPOINTS.LATEST_TASKS).reply(200, { code: 404, data: null });
    const wrapper = await mountDashboard(vi.fn(), false);
    expect(wrapper.vm.latestTasks).toEqual([]);
    wrapper.unmount();
  });

  it('任务列表应包含完整的任务信息字段', async () => {
    const wrapper = await mountDashboard();
    wrapper.vm.latestTasks.forEach(task => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('type');
      expect(task).toHaveProperty('customerName');
      expect(task).toHaveProperty('customerPhone');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('priority');
    });
    wrapper.unmount();
  });
});

describe('useDashboard Composable - 任务类型与优先级标签 (Labels)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('getTaskTypeLabel 应返回正确的任务类型标签', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.getTaskTypeLabel('pendingDelivery')).toBe(TASK_LABELS.pendingDelivery);
    expect(wrapper.vm.getTaskTypeLabel('pendingDelivery')).toBe('待交付');
    expect(wrapper.vm.getTaskTypeLabel('inRent')).toBe('租赁中');
    expect(wrapper.vm.getTaskTypeLabel('pendingAcceptance')).toBe('待验收');
    expect(wrapper.vm.getTaskTypeLabel('pendingRepair')).toBe('待报修处理');
    expect(wrapper.vm.getTaskTypeLabel('afterSale')).toBe('售后处理');
    expect(wrapper.vm.getTaskTypeLabel('all')).toBe('全部任务');
    wrapper.unmount();
  });

  it('getTaskTypeLabel 对于未知类型应返回原值', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.getTaskTypeLabel('unknownType')).toBe('unknownType');
    expect(wrapper.vm.getTaskTypeLabel('')).toBe('');
    wrapper.unmount();
  });

  it('getPriorityLabel 应返回正确的优先级标签', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.getPriorityLabel('high')).toBe(PRIORITY_LABELS.high);
    expect(wrapper.vm.getPriorityLabel('high')).toBe('高优先级');
    expect(wrapper.vm.getPriorityLabel('medium')).toBe('中优先级');
    expect(wrapper.vm.getPriorityLabel('low')).toBe('低优先级');
    wrapper.unmount();
  });

  it('getPriorityLabel 对于未知优先级应返回原值', async () => {
    const wrapper = await mountDashboard();
    expect(wrapper.vm.getPriorityLabel('urgent')).toBe('urgent');
    expect(wrapper.vm.getPriorityLabel(undefined)).toBeUndefined();
    wrapper.unmount();
  });
});

describe('useDashboard Composable - 事件处理 (Event Handlers)', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('handleShortcutClick 应触发 navigate 事件并传递正确参数', async () => {
    const emit = vi.fn();
    const wrapper = await mountDashboard(emit);
    wrapper.vm.handleShortcutClick('pendingDelivery');
    expect(emit).toHaveBeenCalledWith('navigate', {
      type: 'pendingDelivery',
      label: TASK_LABELS.pendingDelivery
    });
    wrapper.unmount();
  });

  it('handleShortcutClick 对不同类型都应正确触发', async () => {
    const emit = vi.fn();
    const wrapper = await mountDashboard(emit);
    const types = ['all', 'pendingDelivery', 'inRent', 'pendingAcceptance', 'afterSale'];
    types.forEach(type => {
      wrapper.vm.handleShortcutClick(type);
      expect(emit).toHaveBeenLastCalledWith('navigate', {
        type,
        label: TASK_LABELS[type]
      });
    });
    wrapper.unmount();
  });

  it('handleViewAllTasks 应触发 navigate 到 all', async () => {
    const emit = vi.fn();
    const wrapper = await mountDashboard(emit);
    wrapper.vm.handleViewAllTasks();
    expect(emit).toHaveBeenCalledWith('navigate', {
      type: 'all',
      label: TASK_LABELS.all
    });
    wrapper.unmount();
  });

  it('handleViewTaskDetail 应触发 viewTask 事件', async () => {
    const emit = vi.fn();
    const wrapper = await mountDashboard(emit);
    const task = wrapper.vm.latestTasks[0];
    wrapper.vm.handleViewTaskDetail(task);
    expect(emit).toHaveBeenCalledWith('viewTask', task);
    wrapper.unmount();
  });

  it('handleContactCustomer 应触发 contactCustomer 事件', async () => {
    const emit = vi.fn();
    const wrapper = await mountDashboard(emit);
    const task = wrapper.vm.latestTasks[0];
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: originalLocation.href },
      writable: true,
      configurable: true
    });
    wrapper.vm.handleContactCustomer(task);
    expect(emit).toHaveBeenCalledWith('contactCustomer', task);
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
    wrapper.unmount();
  });

  it('事件处理在没有 emit 时也不应报错', async () => {
    const wrapper = await mountDashboard(undefined);
    expect(() => wrapper.vm.handleShortcutClick('all')).not.toThrow();
    expect(() => wrapper.vm.handleViewAllTasks()).not.toThrow();
    if (wrapper.vm.latestTasks.length > 0) {
      const task = wrapper.vm.latestTasks[0];
      expect(() => wrapper.vm.handleViewTaskDetail(task)).not.toThrow();
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: { href: originalLocation.href },
        writable: true,
        configurable: true
      });
      expect(() => wrapper.vm.handleContactCustomer(task)).not.toThrow();
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true
      });
    }
    wrapper.unmount();
  });
});

describe('useDashboard Composable - API 方法', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('fetchDashboardStats 应返回 Promise', async () => {
    const wrapper = await mountDashboard();
    const result = wrapper.vm.fetchDashboardStats();
    expect(result).toBeInstanceOf(Promise);
    wrapper.unmount();
  });

  it('fetchLatestTasks 应返回 Promise', async () => {
    const wrapper = await mountDashboard();
    const result = wrapper.vm.fetchLatestTasks();
    expect(result).toBeInstanceOf(Promise);
    wrapper.unmount();
  });

  it('refreshDashboard 应返回 Promise', async () => {
    const wrapper = await mountDashboard();
    const result = wrapper.vm.refreshDashboard();
    expect(result).toBeInstanceOf(Promise);
    wrapper.unmount();
  });
});
