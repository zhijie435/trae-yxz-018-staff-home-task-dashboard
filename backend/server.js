const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());

const EMPLOYEE_ID_PREFIX = 'CGRE';
const EMPLOYEE_ID_DIGITS = 5;
let employeeIdCounter = 1;

const generateEmployeeId = () => {
  const numStr = String(employeeIdCounter).padStart(EMPLOYEE_ID_DIGITS, '0');
  const id = `${EMPLOYEE_ID_PREFIX}${numStr}`;
  employeeIdCounter++;
  return id;
};

const employees = [];

const createEmployee = (name, city, avatar = '') => {
  const id = generateEmployeeId();
  return {
    id,
    name,
    avatar: avatar || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20${name.includes('女') || name.includes('女') || name.endsWith('华') || name.endsWith('兰') || name.endsWith('芳') || name.endsWith('梅') ? 'female' : 'male'}%20employee%20portrait%20photo%20business%20suit%20friendly%20smile%20studio%20lighting&image_size=square_hd`,
    city,
    deliveryCount: Math.floor(Math.random() * 80) + 5,
    joinDate: new Date().toISOString().split('T')[0]
  };
};

const initialEmployees = [
  { name: '张明华', city: '上海' },
  { name: '李建国', city: '北京' },
  { name: '王芳', city: '广州' },
  { name: '陈志强', city: '深圳' },
  { name: '刘玉兰', city: '成都' }
];

initialEmployees.forEach(emp => {
  employees.push(createEmployee(emp.name, emp.city));
});

const employeeData = employees[0];

const dashboardData = {
  todayTasks: 5,
  pendingDelivery: 12,
  inRent: 38,
  pendingAcceptance: 7,
  pendingRepair: 3
};

const latestTasks = [
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
    remark: '请在今天下午3点前送达，客户在家等候'
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

app.get('/api/employee/info', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: employeeData
  });
});

app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: dashboardData
  });
});

app.get('/api/dashboard/latest-tasks', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: latestTasks
  });
});

app.get('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const task = latestTasks.find(t => t.id === taskId);
  if (task) {
    res.json({
      code: 0,
      message: 'success',
      data: task
    });
  } else {
    res.json({
      code: 404,
      message: '任务不存在',
      data: null
    });
  }
});

app.get('/api/employees', (req, res) => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query;
  let filtered = employees;
  if (keyword) {
    filtered = employees.filter(emp => 
      emp.name.includes(keyword) || emp.id.includes(keyword) || emp.city.includes(keyword)
    );
  }
  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filtered.slice(start, end);
  res.json({
    code: 0,
    message: 'success',
    data: {
      list,
      total: filtered.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalEmployeeCount: employees.length,
      nextEmployeeId: `${EMPLOYEE_ID_PREFIX}${String(employeeIdCounter).padStart(EMPLOYEE_ID_DIGITS, '0')}`
    }
  });
});

app.get('/api/employees/:id', (req, res) => {
  const empId = req.params.id;
  const employee = employees.find(emp => emp.id === empId);
  if (employee) {
    res.json({
      code: 0,
      message: 'success',
      data: employee
    });
  } else {
    res.json({
      code: 404,
      message: '员工不存在',
      data: null
    });
  }
});

app.post('/api/employees/apply', (req, res) => {
  const { name, city, avatar = '' } = req.body;
  if (!name || !city) {
    return res.json({
      code: 400,
      message: '姓名和城市不能为空',
      data: null
    });
  }
  const newEmployee = createEmployee(name, city, avatar);
  employees.push(newEmployee);
  res.json({
    code: 0,
    message: '申请成功，员工编号已自动生成',
    data: {
      employee: newEmployee,
      totalEmployeeCount: employees.length,
      nextEmployeeId: `${EMPLOYEE_ID_PREFIX}${String(employeeIdCounter).padStart(EMPLOYEE_ID_DIGITS, '0')}`
    }
  });
});

app.get('/api/employee-id/next', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: {
      prefix: EMPLOYEE_ID_PREFIX,
      digits: EMPLOYEE_ID_DIGITS,
      currentCounter: employeeIdCounter,
      nextId: `${EMPLOYEE_ID_PREFIX}${String(employeeIdCounter).padStart(EMPLOYEE_ID_DIGITS, '0')}`,
      totalApplied: employees.length
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`员工编号前缀: ${EMPLOYEE_ID_PREFIX}, 位数: ${EMPLOYEE_ID_DIGITS}`);
  console.log(`当前下一个编号: ${EMPLOYEE_ID_PREFIX}${String(employeeIdCounter).padStart(EMPLOYEE_ID_DIGITS, '0')}`);
  console.log(`已注册员工数: ${employees.length}`);
});
