const { addToCart, getCartByUserId } = require('../models/orderModel');

// Thêm vào giỏ hàng
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId; // Lấy từ JWT

  try {
    // Kiểm tra tồn kho
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Sản phẩm không đủ số lượng!' });
    }

    // Tạo hoặc lấy order đang pending
    const [order] = await pool.query(
      'INSERT INTO orders (user_id, status) VALUES (?, "pending") ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
      [userId]
    );

    // Thêm vào order_items
    await addToCart(order.insertId, productId, quantity, product.price);
    res.json({ message: 'Thêm vào giỏ hàng thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server!' });
  }
};

// Xem giỏ hàng
exports.getCart = async (req, res) => {
  const userId = req.user.userId;
  const cart = await getCartByUserId(userId);
  res.json(cart);
};