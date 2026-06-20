import { describe, it, expect } from 'vitest';
import {
  getDashboardData,
  getLatestTasksDefault
} from '../server';

describe('待完成数量统计 (Pending Task Counts)', () => {
  describe('默认数据计算', () => {
    it('默认数据应返回正确的各类型待完成数量', () => {
      const data = getDashboardData();
      expect(data.pendingDelivery).toBe(12);
      expect(data.inRent).toBe(38);
      expect(data.pendingAcceptance).toBe(7);
      expect(data.pendingRepair).toBe(3);
    });

    it('今日待完成总数应为各类型数量之和', () => {
      const data = getDashboardData();
      const expectedTotal = 12 + 38 + 7 + 3;
      expect(data.todayTasks).toBe(expectedTotal);
      expect(data.todayTasks).toBe(
        data.pendingDelivery +
        data.inRent +
        data.pendingAcceptance +
        data.pendingRepair
      );
    });

    it('返回对象应包含所有必需字段', () => {
      const data = getDashboardData();
      expect(data).toHaveProperty('todayTasks');
      expect(data).toHaveProperty('pendingDelivery');
      expect(data).toHaveProperty('inRent');
      expect(data).toHaveProperty('pendingAcceptance');
      expect(data).toHaveProperty('pendingRepair');
    });
  });

  describe('自定义数据计算', () => {
    it('可覆盖部分字段，未覆盖字段使用默认值', () => {
      const data = getDashboardData({ pendingDelivery: 20 });
      expect(data.pendingDelivery).toBe(20);
      expect(data.inRent).toBe(38);
      expect(data.pendingAcceptance).toBe(7);
      expect(data.pendingRepair).toBe(3);
    });

    it('自定义所有字段时，应计算正确的总数', () => {
      const overrides = {
        pendingDelivery: 5,
        inRent: 10,
        pendingAcceptance: 15,
        pendingRepair: 20
      };
      const data = getDashboardData(overrides);
      expect(data.todayTasks).toBe(5 + 10 + 15 + 20);
      expect(data.pendingDelivery).toBe(5);
      expect(data.inRent).toBe(10);
      expect(data.pendingAcceptance).toBe(15);
      expect(data.pendingRepair).toBe(20);
    });

    it('当所有数量为0时，今日总数也应为0', () => {
      const data = getDashboardData({
        pendingDelivery: 0,
        inRent: 0,
        pendingAcceptance: 0,
        pendingRepair: 0
      });
      expect(data.todayTasks).toBe(0);
      expect(data.pendingDelivery).toBe(0);
      expect(data.inRent).toBe(0);
      expect(data.pendingAcceptance).toBe(0);
      expect(data.pendingRepair).toBe(0);
    });

    it('大数值时应正确计算总数', () => {
      const overrides = {
        pendingDelivery: 1000,
        inRent: 2000,
        pendingAcceptance: 3000,
        pendingRepair: 4000
      };
      const data = getDashboardData(overrides);
      expect(data.todayTasks).toBe(10000);
    });

    it('待交付数量单独覆盖时计算正确', () => {
      const data = getDashboardData({ pendingDelivery: 5 });
      expect(data.todayTasks).toBe(5 + 38 + 7 + 3);
    });

    it('租赁中数量单独覆盖时计算正确', () => {
      const data = getDashboardData({ inRent: 0 });
      expect(data.todayTasks).toBe(12 + 0 + 7 + 3);
    });

    it('待验收数量单独覆盖时计算正确', () => {
      const data = getDashboardData({ pendingAcceptance: 100 });
      expect(data.todayTasks).toBe(12 + 38 + 100 + 3);
    });

    it('待报修数量单独覆盖时计算正确', () => {
      const data = getDashboardData({ pendingRepair: 99 });
      expect(data.todayTasks).toBe(12 + 38 + 7 + 99);
    });
  });

  describe('字段类型验证', () => {
    it('所有数量字段应为数字类型', () => {
      const data = getDashboardData();
      expect(typeof data.todayTasks).toBe('number');
      expect(typeof data.pendingDelivery).toBe('number');
      expect(typeof data.inRent).toBe('number');
      expect(typeof data.pendingAcceptance).toBe('number');
      expect(typeof data.pendingRepair).toBe('number');
    });

    it('所有数量不应为负数（默认情况）', () => {
      const data = getDashboardData();
      expect(data.todayTasks).toBeGreaterThanOrEqual(0);
      expect(data.pendingDelivery).toBeGreaterThanOrEqual(0);
      expect(data.inRent).toBeGreaterThanOrEqual(0);
      expect(data.pendingAcceptance).toBeGreaterThanOrEqual(0);
      expect(data.pendingRepair).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('最新任务提醒 (Latest Tasks)', () => {
  describe('任务列表结构', () => {
    it('默认应返回3条任务', () => {
      const tasks = getLatestTasksDefault();
      expect(tasks).toHaveLength(3);
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('每个任务对象应包含必需字段', () => {
      const tasks = getLatestTasksDefault();
      const requiredFields = [
        'id',
        'title',
        'type',
        'typeLabel',
        'customerName',
        'customerPhone',
        'address',
        'assignTime',
        'relativeTime',
        'status',
        'priority'
      ];
      tasks.forEach(task => {
        requiredFields.forEach(field => {
          expect(task).toHaveProperty(field);
        });
      });
    });

    it('每个任务应有唯一的 id', () => {
      const tasks = getLatestTasksDefault();
      const ids = tasks.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(tasks.length);
    });
  });

  describe('新任务数量统计', () => {
    it('应有2条新任务（status === new）', () => {
      const tasks = getLatestTasksDefault();
      const newTasks = tasks.filter(t => t.status === 'new');
      expect(newTasks).toHaveLength(2);
    });

    it('应有1条进行中任务（status === processing）', () => {
      const tasks = getLatestTasksDefault();
      const processingTasks = tasks.filter(t => t.status === 'processing');
      expect(processingTasks).toHaveLength(1);
    });

    it('状态字段应为有效值', () => {
      const tasks = getLatestTasksDefault();
      const validStatuses = ['new', 'processing', 'completed', 'cancelled'];
      tasks.forEach(task => {
        expect(validStatuses).toContain(task.status);
      });
    });
  });

  describe('任务类型分布', () => {
    it('待交付类型任务数量', () => {
      const tasks = getLatestTasksDefault();
      const pendingDeliveryTasks = tasks.filter(t => t.type === 'pendingDelivery');
      expect(pendingDeliveryTasks).toHaveLength(1);
    });

    it('待验收类型任务数量', () => {
      const tasks = getLatestTasksDefault();
      const pendingAcceptanceTasks = tasks.filter(t => t.type === 'pendingAcceptance');
      expect(pendingAcceptanceTasks).toHaveLength(1);
    });

    it('租赁中类型任务数量', () => {
      const tasks = getLatestTasksDefault();
      const inRentTasks = tasks.filter(t => t.type === 'inRent');
      expect(inRentTasks).toHaveLength(1);
    });

    it('任务类型应为有效值', () => {
      const tasks = getLatestTasksDefault();
      const validTypes = [
        'pendingDelivery',
        'inRent',
        'pendingAcceptance',
        'pendingRepair',
        'afterSale'
      ];
      tasks.forEach(task => {
        expect(validTypes).toContain(task.type);
      });
    });

    it('type 与 typeLabel 应对应', () => {
      const tasks = getLatestTasksDefault();
      const typeLabelMap = {
        pendingDelivery: '待交付',
        inRent: '租赁中',
        pendingAcceptance: '待验收',
        pendingRepair: '待报修处理',
        afterSale: '售后处理'
      };
      tasks.forEach(task => {
        expect(typeLabelMap[task.type]).toBe(task.typeLabel);
      });
    });
  });

  describe('优先级分布', () => {
    it('优先级应为有效值', () => {
      const tasks = getLatestTasksDefault();
      const validPriorities = ['high', 'medium', 'low'];
      tasks.forEach(task => {
        expect(validPriorities).toContain(task.priority);
      });
    });

    it('高优先级任务数量', () => {
      const tasks = getLatestTasksDefault();
      const highPriority = tasks.filter(t => t.priority === 'high');
      expect(highPriority).toHaveLength(1);
    });

    it('中优先级任务数量', () => {
      const tasks = getLatestTasksDefault();
      const mediumPriority = tasks.filter(t => t.priority === 'medium');
      expect(mediumPriority).toHaveLength(1);
    });

    it('低优先级任务数量', () => {
      const tasks = getLatestTasksDefault();
      const lowPriority = tasks.filter(t => t.priority === 'low');
      expect(lowPriority).toHaveLength(1);
    });
  });

  describe('客户信息完整性', () => {
    it('每个任务应有客户姓名，且非空', () => {
      const tasks = getLatestTasksDefault();
      tasks.forEach(task => {
        expect(typeof task.customerName).toBe('string');
        expect(task.customerName.length).toBeGreaterThan(0);
      });
    });

    it('每个任务应有客户电话，格式为中间带*号', () => {
      const tasks = getLatestTasksDefault();
      tasks.forEach(task => {
        expect(typeof task.customerPhone).toBe('string');
        expect(task.customerPhone).toMatch(/^\d{3}\*{4}\d{4}$/);
      });
    });

    it('每个任务应有详细地址，且非空', () => {
      const tasks = getLatestTasksDefault();
      tasks.forEach(task => {
        expect(typeof task.address).toBe('string');
        expect(task.address.length).toBeGreaterThan(0);
      });
    });
  });

  describe('时间信息验证', () => {
    it('assignTime 应为标准日期时间格式', () => {
      const tasks = getLatestTasksDefault();
      tasks.forEach(task => {
        expect(task.assignTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      });
    });

    it('relativeTime 应为非空字符串', () => {
      const tasks = getLatestTasksDefault();
      tasks.forEach(task => {
        expect(typeof task.relativeTime).toBe('string');
        expect(task.relativeTime.length).toBeGreaterThan(0);
      });
    });

    it('任务列表应按时间倒序排列（最新的在最前）', () => {
      const tasks = getLatestTasksDefault();
      for (let i = 0; i < tasks.length - 1; i++) {
        const time1 = new Date(tasks[i].assignTime).getTime();
        const time2 = new Date(tasks[i + 1].assignTime).getTime();
        expect(time1).toBeGreaterThanOrEqual(time2);
      }
    });
  });

  describe('任务详情', () => {
    it('任务标题非空', () => {
      const tasks = getLatestTasksDefault();
      tasks.forEach(task => {
        expect(typeof task.title).toBe('string');
        expect(task.title.length).toBeGreaterThan(0);
      });
    });

    it('第一条新任务应为待交付高优先级', () => {
      const tasks = getLatestTasksDefault();
      const firstNew = tasks.find(t => t.id === 'TASK20240620001');
      expect(firstNew).toBeDefined();
      expect(firstNew.status).toBe('new');
      expect(firstNew.type).toBe('pendingDelivery');
      expect(firstNew.priority).toBe('high');
    });

    it('进行中的任务应为租赁中且低优先级', () => {
      const tasks = getLatestTasksDefault();
      const processingTask = tasks.find(t => t.status === 'processing');
      expect(processingTask).toBeDefined();
      expect(processingTask.type).toBe('inRent');
      expect(processingTask.priority).toBe('low');
    });

    it('备注字段：部分任务应有备注', () => {
      const tasks = getLatestTasksDefault();
      const tasksWithRemark = tasks.filter(t => t.remark && t.remark.length > 0);
      expect(tasksWithRemark.length).toBeGreaterThan(0);
      tasksWithRemark.forEach(task => {
        expect(typeof task.remark).toBe('string');
      });
    });
  });
});
