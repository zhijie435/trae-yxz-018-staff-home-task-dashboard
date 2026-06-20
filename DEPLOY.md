# 员工端首页任务看板 - 部署文档

## 一、项目概述

本项目为员工端首页任务看板系统，包含后端 API 服务和前端页面两部分，用于展示员工信息、任务统计和最新任务列表。

- **后端技术栈**: Node.js + Express
- **前端技术栈**: Vue 3 + Vite
- **测试框架**: Vitest

## 二、环境要求

- Node.js >= 16
- npm >= 8

## 三、项目目录结构

```
018-员工端首页任务看板/
├── backend/          # 后端服务
│   ├── server.js     # 服务入口
│   ├── tests/        # 后端测试用例
│   └── package.json
├── frontend/         # 前端应用
│   ├── src/          # 前端源码
│   ├── tests/        # 前端测试用例
│   └── package.json
└── DEPLOY.md         # 本文档
```

## 四、部署步骤

### 4.1 后端服务部署

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 启动服务（默认端口 8888）
npm run start
```

后端服务启动后访问: `http://localhost:8888`

### 4.2 前端应用部署

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 开发模式启动（默认端口 5173，已配置 /api 代理到后端 8888 端口）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

前端应用启动后访问: `http://localhost:5173`

## 五、员工账号种子数据

服务启动时自动初始化以下 5 个员工账号，员工编号格式为 `CGRE` + 5 位数字（如 `CGRE00001`）：

| 员工编号 | 姓名 | 城市 | 交付次数范围 | 自动计算等级 |
|---------|------|------|------------|------------|
| CGRE00001 | 张明华 | 上海 | 5 ~ 124（随机） | 初级 / 中级 / 高级 |
| CGRE00002 | 李建国 | 北京 | 5 ~ 124（随机） | 初级 / 中级 / 高级 |
| CGRE00003 | 王芳 | 广州 | 5 ~ 124（随机） | 初级 / 中级 / 高级 |
| CGRE00004 | 陈志强 | 深圳 | 5 ~ 124（随机） | 初级 / 中级 / 高级 |
| CGRE00005 | 刘玉兰 | 成都 | 5 ~ 124（随机） | 初级 / 中级 / 高级 |

### 员工等级规则

| 等级 | 类型标识 | 最低交付次数 |
|-----|---------|------------|
| 初级工程师 | junior | 0 |
| 中级工程师 | intermediate | 30 |
| 高级工程师 | senior | 100 |

### 获取当前登录员工信息

当前默认展示员工列表中的第一个员工（张明华），可通过以下接口获取：

```bash
curl http://localhost:8888/api/employee/info
```

## 六、任务种子数据

### 6.1 任务统计数据

| 任务类型 | 类型标识 | 默认数量 |
|---------|---------|---------|
| 待交付 | pendingDelivery | 12 |
| 租赁中 | inRent | 38 |
| 待验收 | pendingAcceptance | 7 |
| 待报修处理 | pendingRepair | 3 |
| **今日待完成合计** | todayTasks | **60** |

### 6.2 最新任务列表（共 3 条）

| 任务编号 | 任务标题 | 类型 | 状态 | 优先级 | 客户 | 地址 |
|---------|---------|------|------|-------|------|------|
| TASK20240620001 | 上海市浦东新区XX小区设备交付 | 待交付 | new | high | 李先生 138****5678 | 上海市浦东新区张江高科技园区博云路2号 |
| TASK20240620002 | 徐汇区商务楼设备验收 | 待验收 | new | medium | 王经理 139****1234 | 上海市徐汇区淮海中路168号 |
| TASK20240619003 | 闵行区租赁设备维护检查 | 租赁中 | processing | low | 张女士 137****9876 | 上海市闵行区莘庄工业区申富路668号 |

### 6.3 任务数据接口

```bash
# 获取看板统计数据
curl http://localhost:8888/api/dashboard/stats

# 获取最新任务列表
curl http://localhost:8888/api/dashboard/latest-tasks

# 获取单个任务详情
curl http://localhost:8888/api/tasks/TASK20240620001
```

## 七、验收命令

### 7.1 后端单元测试

```bash
cd backend
npm run test:run
```

后端测试包含两个测试文件：
- `tests/employee.test.js` - 员工编号生成、等级计算、员工创建测试
- `tests/dashboard.test.js` - 任务统计数据、最新任务列表测试

### 7.2 前端单元测试

```bash
cd frontend
npm run test:run
```

前端测试包含两个测试文件：
- `tests/useEmployee.test.js` - 员工信息 Composable 测试
- `tests/useDashboard.test.js` - 看板数据 Composable 测试

### 7.3 完整验收流程

```bash
# 1. 安装后端依赖并运行测试
cd backend && npm install && npm run test:run

# 2. 安装前端依赖并运行测试
cd ../frontend && npm install && npm run test:run

# 3. 启动后端服务
cd ../backend && npm run start &

# 4. 启动前端开发服务
cd ../frontend && npm run dev
```

所有测试通过且服务正常启动后，即可在浏览器访问 `http://localhost:5173` 进行人工验收。

## 八、API 接口列表

| 方法 | 路径 | 说明 |
|-----|------|-----|
| GET | /api/employee/info | 获取当前员工信息 |
| GET | /api/dashboard/stats | 获取看板任务统计数据 |
| GET | /api/dashboard/latest-tasks | 获取最新任务列表 |
| GET | /api/tasks/:id | 获取单个任务详情 |
| GET | /api/employees | 员工列表（支持分页、关键词搜索） |
| GET | /api/employees/:id | 获取指定员工详情 |
| POST | /api/employees/apply | 申请新员工（自动生成编号） |
| GET | /api/employee-id/next | 获取下一个可用员工编号 |
