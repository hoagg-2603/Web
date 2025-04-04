const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Yêu cầu đăng nhập
router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);

module.exports = router;