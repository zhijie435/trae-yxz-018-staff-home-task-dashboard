const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());

const employeeData = {
  id: 'EMP001',
  name: '张明华',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20asian%20male%20employee%20portrait%20photo%20business%20suit%20friendly%20smile%20studio%20lighting&image_size=square_hd',
  city: '上海',
  deliveryCount: 45
};

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

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
