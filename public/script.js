document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    // Dữ liệu mẫu (Giống file data/products.json)
    const localProducts = [
        {
            "id": 1,
            "name": "CHAT GPT",
            "description": "Tài khoản Chat GPT Plus, Business",
            "options": [
                { "name": "Plus", "price": 450000, "duration": "1 tháng" },
                { "name": "Business", "price": 900000, "duration": "1 tháng" }
            ],
            "category": "AI",
            "image": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
        },
        {
            "id": 2,
            "name": "Grok AI",
            "description": "Tài khoản Grok Premium",
            "options": [
                { "name": "Grok 7 Day", "price": 50000, "duration": "7 ngày" }
            ],
            "category": "AI",
            "image": "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png"
        },
        {
            "id": 3,
            "name": "Telegram Premium",
            "description": "Nâng cấp Telegram Premium chính chủ",
            "options": [
                { "name": "3 Tháng", "price": 300000, "duration": "3 tháng" },
                { "name": "6 Tháng", "price": 550000, "duration": "6 tháng" }
            ],
            "category": "Social",
            "image": "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
        },
        {
            "id": 4,
            "name": "Youtube Premium",
            "description": "Youtube Premium không quảng cáo",
            "options": [
                { "name": "3 Tháng", "price": 70000, "duration": "3 tháng" },
                { "name": "6 Tháng", "price": 130000, "duration": "6 tháng" },
                { "name": "18 Tháng", "price": 350000, "duration": "18 tháng" }
            ],
            "category": "Entertainment",
            "image": "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
        },
        {
            "id": 5,
            "name": "CapCut Pro",
            "description": "Tài khoản CapCut Pro full tính năng",
            "options": [
                { "name": "35 Ngày", "price": 30000, "duration": "35 ngày" },
                { "name": "2 Tháng", "price": 55000, "duration": "2 tháng" },
                { "name": "6 Tháng", "price": 150000, "duration": "6 tháng" },
                { "name": "12 Tháng", "price": 280000, "duration": "12 tháng" }
            ],
            "category": "Edit",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/CapCut_logo.svg/1200px-CapCut_logo.svg.png"
        },
        {
            "id": 6,
            "name": "CapCut Pro Team",
            "description": "Gói Team giá rẻ cho editor",
            "options": [
                { "name": "35 Ngày", "price": 25000, "duration": "35 ngày" },
                { "name": "2 Tháng", "price": 45000, "duration": "2 tháng" },
                { "name": "6 Tháng", "price": 130000, "duration": "6 tháng" },
                { "name": "12 Tháng", "price": 250000, "duration": "12 tháng" }
            ],
            "category": "Edit",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/CapCut_logo.svg/1200px-CapCut_logo.svg.png"
        },
        {
            "id": 7,
            "name": "Netflix 4K HDR",
            "description": "Xem phim Netflix chất lượng cao 4K",
            "options": [
                { "name": "1 Tháng", "price": 60000, "duration": "1 tháng" }
            ],
            "category": "Entertainment",
            "image": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
        },
        {
            "id": 8,
            "name": "Veo3 Credit",
            "description": "Tài khoản Veo3 có sẵn credit",
            "options": [
                { "name": "45k Credit", "price": 45000, "duration": "Vĩnh viễn" }
            ],
            "category": "AI",
            "image": "https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
        }
    ];

    // Hàm format giá tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    let stockData = {};

    // Fetch stock data from server
    async function fetchStock() {
        try {
            const response = await fetch('http://localhost:3000/api/stock');
            if (response.ok) {
                stockData = await response.json();
            }
        } catch (error) {
            console.error("Error fetching stock:", error);
        }
        renderProducts(localProducts);
    }

    // Hàm render sản phẩm
    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            // Lấy giá thấp nhất để hiển thị "Từ..."
            const minPrice = Math.min(...product.options.map(opt => opt.price));

            // Get stock info for this product
            // Key mapping: convert name to lowercase to match server keys
            const stockKey = product.name.toLowerCase();
            const info = stockData[stockKey] || { available: 0, sold: 0 };

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="stock-info">
                        <span class="stock-available">Còn lại: ${info.available}</span> | 
                        <span class="stock-sold">Đã bán: ${info.sold}</span>
                    </p>
                    <p>${product.description}</p>
                    <div class="product-actions">
                        <span class="price">Từ ${formatCurrency(minPrice)}</span>
                        <button class="btn-buy" onclick="buyProduct('${product.name}')">Mua Ngay</button>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    // Init Logic
    fetchStock();

    // Loop fetch stock every 30 seconds to keep updated
    setInterval(fetchStock, 30000);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Hàm mua sản phẩm (Global)
async function buyProduct(productName) {
    if (!confirm(`Bạn có chắc chắn muốn mua ${productName}?`)) return;

    try {
        const response = await fetch(`http://localhost:3000/api/buy/${encodeURIComponent(productName)}`);
        const data = await response.json();

        if (data.success) {
            alert(`Mua thành công!\nTài khoản của bạn: ${data.account}`);
            // Refresh stock display
            // Reload page or re-fetch stock
            window.location.reload();
        } else {
            alert(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        console.error("Lỗi mua hàng:", error);
        alert("Có lỗi xảy ra khi kết nối tới server.");
    }
}

