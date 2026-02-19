document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    let db;

    // Khởi tạo Firebase
    if (typeof firebase !== 'undefined') {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
        } catch (e) {
            console.error("Firebase init error:", e);
        }
    }

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    let stockData = {};

    function renderProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const minPrice = Math.min(...product.options.map(opt => opt.price));
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

    // Subscribe to Firestore updates for Realtime Stock
    function subscribeStock() {
        if (!db) return;

        // Listen to 'accounts' collection
        db.collection("accounts").where("status", "==", "available")
            .onSnapshot((snapshot) => {
                const tempStock = {};
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const prodName = data.product.toLowerCase();
                    if (!tempStock[prodName]) tempStock[prodName] = 0;
                    tempStock[prodName]++;
                });

                Object.keys(tempStock).forEach(key => {
                    if (!stockData[key]) stockData[key] = { available: 0, sold: 0 };
                    stockData[key].available = tempStock[key];
                });

                renderProducts(localProducts);
            });

        db.collection("accounts").where("status", "==", "sold")
            .onSnapshot((snapshot) => {
                const tempSold = {};
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const prodName = data.product.toLowerCase();
                    if (!tempSold[prodName]) tempSold[prodName] = 0;
                    tempSold[prodName]++;
                });

                Object.keys(tempSold).forEach(key => {
                    if (!stockData[key]) stockData[key] = { available: 0, sold: 0 };
                    stockData[key].sold = tempSold[key];
                });
                renderProducts(localProducts);
            });
    }

    if (db) {
        subscribeStock();
    } else {
        renderProducts(localProducts); // Fallback
    }

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
    if (typeof firebase === 'undefined') {
        alert("Lỗi: Firebase chưa được tải.");
        return;
    }

    if (!confirm(`Bạn có chắc chắn muốn mua ${productName}?`)) return;

    const db = firebase.firestore();
    const accountsRef = db.collection('accounts');
    const q = accountsRef.where('product', '==', productName.toLowerCase()).where('status', '==', 'available').limit(1);

    try {
        await db.runTransaction(async (transaction) => {
            const snapshot = await transaction.get(q);
            if (snapshot.empty) {
                throw "Hết hàng!";
            }

            const accountDoc = snapshot.docs[0];
            const accountData = accountDoc.data();

            // Cập nhật trạng thái thành sold
            transaction.update(accountDoc.ref, {
                status: 'sold',
                soldAt: new Date()
            });

            // Trả về dữ liệu tài khoản cho user view
            return accountData.data;
        }).then((accountInfo) => {
            alert(`Mua thành công!\nTài khoản của bạn: ${accountInfo}`);
        }).catch((error) => {
            console.error("Giao dịch thất bại: ", error);
            if (error === "Hết hàng!") {
                alert("Sản phẩm này hiện đã hết hàng.");
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        });
    } catch (e) {
        console.error(e);
    }
}
