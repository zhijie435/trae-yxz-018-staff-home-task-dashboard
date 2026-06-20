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
  city: '上海'
};

app.get('/api/employee/info', (req, res) => {
  res.json({
    code: 0,
    message: 'success',
    data: employeeData
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
