import { describe, it, expect, beforeEach } from 'vitest';
import {
  EMPLOYEE_ID_PREFIX,
  EMPLOYEE_ID_DIGITS,
  generateEmployeeId,
  resetEmployeeIdCounter,
  calculateLevel,
  createEmployee
} from '../server';

describe('员工编号生成 (Employee ID Generation)', () => {
  beforeEach(() => {
    resetEmployeeIdCounter(1);
  });

  it('应生成正确格式的员工编号：前缀 + 5位数字', () => {
    const id = generateEmployeeId();
    expect(id).toMatch(/^CGRE\d{5}$/);
    expect(id.startsWith(EMPLOYEE_ID_PREFIX)).toBe(true);
    expect(id.length).toBe(EMPLOYEE_ID_PREFIX.length + EMPLOYEE_ID_DIGITS);
  });

  it('第一个员工编号应为 CGRE00001', () => {
    const id = generateEmployeeId();
    expect(id).toBe('CGRE00001');
  });

  it('第二个员工编号应为 CGRE00002，编号应递增', () => {
    const id1 = generateEmployeeId();
    const id2 = generateEmployeeId();
    expect(id1).toBe('CGRE00001');
    expect(id2).toBe('CGRE00002');
  });

  it('生成100个编号后应正确递增到 CGRE00100', () => {
    let lastId = '';
    for (let i = 1; i <= 100; i++) {
      lastId = generateEmployeeId();
    }
    expect(lastId).toBe('CGRE00100');
  });

  it('边界情况：计数器重置后应从1重新开始', () => {
    generateEmployeeId();
    generateEmployeeId();
    resetEmployeeIdCounter(1);
    const id = generateEmployeeId();
    expect(id).toBe('CGRE00001');
  });

  it('员工编号数字部分应为5位，不足部分补零', () => {
    resetEmployeeIdCounter(42);
    const id = generateEmployeeId();
    expect(id).toBe('CGRE00042');

    resetEmployeeIdCounter(123);
    const id2 = generateEmployeeId();
    expect(id2).toBe('CGRE00123');

    resetEmployeeIdCounter(99999);
    const id3 = generateEmployeeId();
    expect(id3).toBe('CGRE99999');
  });

  it('应正确识别前缀和位数常量', () => {
    expect(EMPLOYEE_ID_PREFIX).toBe('CGRE');
    expect(EMPLOYEE_ID_DIGITS).toBe(5);
  });
});

describe('员工等级计算 (Level Calculation)', () => {
  describe('初级工程师 (Junior)', () => {
    it('交付次数为 0 应为初级工程师', () => {
      const level = calculateLevel(0);
      expect(level).toEqual({ type: 'junior', label: '初级工程师' });
    });

    it('交付次数为 1 应为初级工程师', () => {
      const level = calculateLevel(1);
      expect(level.type).toBe('junior');
      expect(level.label).toBe('初级工程师');
    });

    it('交付次数为 29 应为初级工程师（边界值）', () => {
      const level = calculateLevel(29);
      expect(level.type).toBe('junior');
      expect(level.label).toBe('初级工程师');
    });
  });

  describe('中级工程师 (Intermediate)', () => {
    it('交付次数为 30 应为中级工程师（边界值）', () => {
      const level = calculateLevel(30);
      expect(level.type).toBe('intermediate');
      expect(level.label).toBe('中级工程师');
    });

    it('交付次数为 50 应为中级工程师', () => {
      const level = calculateLevel(50);
      expect(level).toEqual({ type: 'intermediate', label: '中级工程师' });
    });

    it('交付次数为 99 应为中级工程师（边界值）', () => {
      const level = calculateLevel(99);
      expect(level.type).toBe('intermediate');
      expect(level.label).toBe('中级工程师');
    });
  });

  describe('高级工程师 (Senior)', () => {
    it('交付次数为 100 应为高级工程师（边界值）', () => {
      const level = calculateLevel(100);
      expect(level.type).toBe('senior');
      expect(level.label).toBe('高级工程师');
    });

    it('交付次数为 500 应为高级工程师', () => {
      const level = calculateLevel(500);
      expect(level).toEqual({ type: 'senior', label: '高级工程师' });
    });

    it('交付次数为 10000 应为高级工程师（大数值）', () => {
      const level = calculateLevel(10000);
      expect(level.type).toBe('senior');
    });
  });

  describe('异常输入处理', () => {
    it('负数交付次数应视为初级工程师', () => {
      const level = calculateLevel(-10);
      expect(level.type).toBe('junior');
    });

    it('小数交付次数应按整数判断（非标准）', () => {
      const level = calculateLevel(29.9);
      expect(level.type).toBe('junior');

      const level2 = calculateLevel(30.1);
      expect(level2.type).toBe('intermediate');
    });
  });
});

describe('员工创建 (Create Employee)', () => {
  beforeEach(() => {
    resetEmployeeIdCounter(1);
  });

  it('应创建包含基本信息的员工对象', () => {
    const employee = createEmployee('张三', '北京');
    expect(employee).toHaveProperty('id');
    expect(employee).toHaveProperty('name', '张三');
    expect(employee).toHaveProperty('city', '北京');
    expect(employee).toHaveProperty('avatar');
    expect(employee).toHaveProperty('deliveryCount');
    expect(employee).toHaveProperty('level');
    expect(employee).toHaveProperty('joinDate');
  });

  it('创建员工时应自动生成员工编号', () => {
    const employee = createEmployee('李四', '上海');
    expect(employee.id).toBe('CGRE00001');
  });

  it('创建多个员工时编号应递增', () => {
    const emp1 = createEmployee('王五', '广州');
    const emp2 = createEmployee('赵六', '深圳');
    expect(emp1.id).toBe('CGRE00001');
    expect(emp2.id).toBe('CGRE00002');
  });

  it('可通过 options 指定固定 deliveryCount 以测试等级计算', () => {
    const juniorEmp = createEmployee('初级员工', '成都', '', { deliveryCount: 10 });
    expect(juniorEmp.level.type).toBe('junior');
    expect(juniorEmp.deliveryCount).toBe(10);

    const intermediateEmp = createEmployee('中级员工', '杭州', '', { deliveryCount: 50 });
    expect(intermediateEmp.level.type).toBe('intermediate');
    expect(intermediateEmp.deliveryCount).toBe(50);

    const seniorEmp = createEmployee('高级员工', '武汉', '', { deliveryCount: 150 });
    expect(seniorEmp.level.type).toBe('senior');
    expect(seniorEmp.deliveryCount).toBe(150);
  });

  it('可通过 options 指定员工编号', () => {
    const employee = createEmployee('测试', '测试市', '', { id: 'CGRE99999' });
    expect(employee.id).toBe('CGRE99999');
  });

  it('可通过 options 指定入职日期', () => {
    const joinDate = '2023-01-15';
    const employee = createEmployee('新员工', '南京', '', { joinDate });
    expect(employee.joinDate).toBe(joinDate);
  });

  it('deliveryCount 在未指定时应在 5-124 之间', () => {
    for (let i = 0; i < 50; i++) {
      const employee = createEmployee(`测试${i}`, '北京');
      expect(employee.deliveryCount).toBeGreaterThanOrEqual(5);
      expect(employee.deliveryCount).toBeLessThanOrEqual(124);
    }
  });

  it('level 对象应包含 type 和 label', () => {
    const employee = createEmployee('测试', '北京', '', { deliveryCount: 50 });
    expect(employee.level).toHaveProperty('type');
    expect(employee.level).toHaveProperty('label');
    expect(typeof employee.level.type).toBe('string');
    expect(typeof employee.level.label).toBe('string');
  });
});
