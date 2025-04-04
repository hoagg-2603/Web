const express = require('express');
const app = express();
const pool = require('./src/db');

app.use(express.json());

// API lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).send('Lỗi server');
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});