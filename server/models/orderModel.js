const pool = require('../config/db');

// Thêm sản phẩm vào giỏ hàng
async function addToCart(orderId, productId, quantity, price) {
  await pool.query(
    'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
    [orderId, productId, quantity, price]
  );
}

// Lấy giỏ hàng của user
async function getCartByUserId(userId) {
  const [orders] = await pool.query(
    `SELECT o.id AS order_id, p.id AS product_id, p.name, oi.quantity, oi.price_at_purchase 
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN products p ON oi.product_id = p.id
     WHERE o.user_id = ? AND o.status = 'pending'`,
    [userId]
  );
  return orders;
}