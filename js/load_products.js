document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const DOM = {
        searchBar: document.getElementById("search-bar"),
        searchButton: document.getElementById("search-button"),
        filterButton: document.getElementById("filter-button"),
        filterPanel: document.getElementById("filter-panel"),
        applyFilter: document.getElementById("apply-filter"),
        productList: document.getElementById("product-list"),
        cartCounters: document.querySelectorAll('.cart-counter')
    };

    let products = [];

    // Product Manager
    const ProductManager = {
        async loadProducts() {
            try {
                const response = await fetch("products/products.json");
                products = await response.json();
                this.renderProducts(products);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            }
        },

        renderProducts(products) {
            DOM.productList.innerHTML = products
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(product => this.createProductCard(product))
                .join("");
            
            this.attachCartEvents();
        },

        createProductCard(product) {
            return `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            ${product.description ? `<p class="card-text">${product.description}</p>` : ''}
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-primary">${this.formatPrice(product.price)}</span>
                                <button class="btn btn-primary add-to-cart" 
                                    data-id="${product.id}"
                                    data-name="${product.name}"
                                    data-price="${product.price}"
                                    data-image="${product.image}">
                                    <i class="fas fa-cart-plus"></i> Thêm giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
            }).format(price);
        },

        attachCartEvents() {
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const target = e.currentTarget;
                    const product = {
                        id: target.dataset.id,
                        name: target.dataset.name,
                        price: Number(target.dataset.price),
                        image: target.dataset.image
                    };
                    CartManager.addItem(product);
                });
            });
        }
    };

    // Cart Manager
    const CartManager = {
        addItem(product) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.id === product.id);
            
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({...product, quantity:0});
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartUI();
            this.showAlert(`Đã thêm ${product.name} vào giỏ!`);
        },

        updateCartUI() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            // Cập nhật cả localStorage count
            localStorage.setItem('cartCount', total);
            DOM.cartCounters.forEach(counter => counter.textContent = total);
            
            // Kích hoạt sự kiện
            window.dispatchEvent(new Event('storage'));
        },

        showAlert(message) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'cart-alert alert alert-success';
            alertDiv.textContent = message;
            
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 2000);
        }
    };

    // Event Handlers
    const setupEventListeners = () => {
        // Tìm kiếm
        DOM.searchButton.addEventListener('click', () => {
            const keyword = DOM.searchBar.value.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(keykeyword)
            );
            ProductManager.renderProducts(filtered);
        });

        // Bộ lọc
        DOM.filterButton.addEventListener('click', () => 
            DOM.filterPanel.classList.toggle('d-none')
        );

        DOM.applyFilter.addEventListener('click', () => {
            const type = document.getElementById("filter-type").value;
            const minPrice = document.getElementById("min-price").value;
            const maxPrice = document.getElementById("max-price").value;

            let filtered = products;
            if (type) filtered = filtered.filter(p => p.type === type);
            if (minPrice) filtered = filtered.filter(p => p.price >= minPrice);
            if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);

            ProductManager.renderProducts(filtered);
        });
    };

    // Khởi động
    const initialize = () => {
        ProductManager.loadProducts();
        CartManager.updateCartUI();
        setupEventListeners();
    };

    initialize();
});