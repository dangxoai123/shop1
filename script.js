// Dữ liệu sản phẩm (Global)
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

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    let db;
    let auth;
    let currentUser = null;

    // Elements
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name-display');
    const userBalanceDisplay = document.getElementById('user-balance-display');
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Khởi tạo Firebase
    if (typeof firebase !== 'undefined') {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            auth = firebase.auth();

            // Lắng nghe trạng thái đăng nhập
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    currentUser = user;
                    console.log("Logged in as:", user.email);

                    // Ẩn nút đăng nhập, hiện profile
                    if (authButtons) authButtons.style.display = 'none';
                    if (userProfile) userProfile.style.display = 'flex';

                    // Lấy thông tin user từ Firestore
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        userNameDisplay.textContent = userData.name || user.displayName || "User";
                        userBalanceDisplay.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(userData.balance || 0);
                    } else {
                        // Nếu chưa có doc (lỗi nào đó), tạo mới
                        userNameDisplay.textContent = user.displayName || user.email;
                        userBalanceDisplay.textContent = "0 ₫";
                    }

                    closeModal(); // Đóng modal nếu đang mở
                } else {
                    currentUser = null;
                    console.log("Logged out");

                    // Hiện nút đăng nhập, ẩn profile
                    if (authButtons) authButtons.style.display = 'flex';
                    if (userProfile) userProfile.style.display = 'none';

                    userNameDisplay.textContent = "";
                    userBalanceDisplay.textContent = "";
                }
            });

        } catch (e) {
            console.error("Firebase init error:", e);
        }
    }

    // Modal Logic
    window.openModal = (tab) => {
        if (!authModal) return;
        authModal.classList.add('show-modal');
        switchTab(tab);
    };

    window.closeModal = () => {
        if (!authModal) return;
        authModal.classList.remove('show-modal');
    };

    window.switchTab = (tab) => {
        const loginBtn = document.querySelector(".tab-btn[onclick=\"switchTab('login')\"]");
        const registerBtn = document.querySelector(".tab-btn[onclick=\"switchTab('register')\"]");

        if (tab === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            loginBtn.classList.add('active');
            registerBtn.classList.remove('active');
        } else {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            loginBtn.classList.remove('active');
            registerBtn.classList.add('active');
        }
    };

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target == authModal) {
            closeModal();
        }
    };

    // Register Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                alert("Mật khẩu nhập lại không khớp!");
                return;
            }

            try {
                // Tạo user auth
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Cập nhật profile auth (DisplayName)
                await user.updateProfile({
                    displayName: name
                });

                // Tạo user document trong Firestore
                await db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    name: name,
                    email: email,
                    balance: 0,
                    role: 'user',
                    createdAt: new Date()
                });

                alert("Đăng ký thành công!");
                registerForm.reset();
            } catch (error) {
                console.error(error);
                let msg = "Đăng ký thất bại: " + error.message;
                if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
                    msg = "Lỗi Cấu Hình: Bạn chưa bật tính năng đăng nhập Email/Password trong Firebase Console.\nVui lòng vào Authentication -> Sign-in method -> Bật Email/Password.";
                } else if (error.code === 'auth/email-already-in-use') {
                    msg = "Email này đã được sử dụng.";
                } else if (error.code === 'auth/weak-password') {
                    msg = "Mật khẩu quá yếu (cần ít nhất 6 ký tự).";
                }
                alert(msg);
            }
        });
    }

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                await auth.signInWithEmailAndPassword(email, password);
                // Auth state listener sẽ xử lý UI update
                alert("Đăng nhập thành công!");
                loginForm.reset();
            } catch (error) {
                console.error(error);
                let msg = "Đăng nhập thất bại: " + error.message;
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    msg = "Sai email hoặc mật khẩu.";
                } else if (error.code === 'auth/configuration-not-found') {
                    msg = "Lỗi Cấu Hình: Bạn chưa bật tính năng đăng nhập Email/Password trong Firebase Console.";
                }
                alert(msg);
            }
        });
    }

    // Logout Handler
    window.logoutUser = () => {
        if (auth) {
            auth.signOut().then(() => {
                alert("Đã đăng xuất.");
                // Reset UI is handled by onAuthStateChanged
            }).catch((error) => {
                console.error("Logout error", error);
            });
        }
    };


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    let stockData = {};

    function renderProducts(products) {
        if (!productList) return;
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
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Helper Modals
function showConfirmModal(productName, price, currentBalance) {
    return new Promise((resolve, reject) => {
        const modal = document.getElementById('confirm-modal');
        const btnConfirm = document.getElementById('btn-confirm-purchase');
        const btnCancel = document.querySelector('#confirm-modal .btn-cancel');

        // Update UI
        document.getElementById('confirm-product-name').textContent = productName;
        document.getElementById('confirm-product-price').textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        document.getElementById('confirm-user-balance').textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBalance);
        document.getElementById('confirm-new-balance').textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBalance - price);

        // Show Modal
        modal.classList.add('show-modal');

        // Handle Events
        const cleanup = () => {
            btnConfirm.onclick = null;
            btnCancel.onclick = null;
            // Remove click outside listener specifically for this instance if needed, 
            // but global window.onclick handles closing. We just need to ensure resolve/reject isn't called twice if closed via other means.
        };

        btnConfirm.onclick = () => {
            cleanup();
            modal.classList.remove('show-modal');
            resolve(true);
        };

        btnCancel.onclick = () => {
            cleanup();
            modal.classList.remove('show-modal');
            reject("User cancelled");
        };

        // Override global close for this modal to reject promise
        window.closeConfirmModal = () => {
            cleanup();
            modal.classList.remove('show-modal');
            reject("User cancelled");
        };
    });
}

function showSuccessModal(accountInfo, newBalance) {
    const modal = document.getElementById('success-modal');
    document.getElementById('success-account-info').textContent = accountInfo;
    document.getElementById('success-new-balance').textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(newBalance);
    modal.classList.add('show-modal');
}

window.closeSuccessModal = () => {
    document.getElementById('success-modal').classList.remove('show-modal');
}

window.copyAccountInfo = () => {
    const text = document.getElementById('success-account-info').textContent;
    copyTextToClipboard(text, document.querySelector('.btn-copy'));
}

function copyTextToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = "Đã chép!";
        setTimeout(() => btnElement.textContent = originalText, 2000);
    }).catch(err => {
        console.error('Không thể copy: ', err);
    });
}

// History Modal Logic
window.closeHistoryModal = () => {
    document.getElementById('history-modal').classList.remove('show-modal');
}

window.openHistoryModal = () => {
    const modal = document.getElementById('history-modal');
    modal.classList.add('show-modal');
    loadPurchaseHistory();
}

async function loadPurchaseHistory() {
    if (typeof firebase === 'undefined') return;
    const auth = firebase.auth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const historyBody = document.getElementById('history-list-body');
    const loadingDiv = document.getElementById('history-loading');
    const emptyDiv = document.getElementById('history-empty');

    // UI Reset
    historyBody.innerHTML = '';
    loadingDiv.style.display = 'block';
    emptyDiv.style.display = 'none';

    try {
        const db = firebase.firestore();
        // Query accounts where buyerUid match
        // Note: Cần index cho query này nếu dữ liệu lớn (buyerUid ASC, soldAt DESC)
        // Nếu chưa có index, Firebase sẽ báo lỗi kèm link tạo index trong console.
        const snapshot = await db.collection('accounts')
            .where('buyerUid', '==', currentUser.uid)
            .orderBy('soldAt', 'desc')
            .get();

        loadingDiv.style.display = 'none';

        if (snapshot.empty) {
            emptyDiv.style.display = 'block';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.soldAt ? new Date(data.soldAt.seconds * 1000).toLocaleString('vi-VN') : 'N/A';
            const price = data.soldPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.soldPrice) : 'N/A';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.product}</td>
                <td>${price}</td>
                <td style="font-size: 0.9rem; color: #aaa;">${date}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        <span class="history-code-cell">${data.data}</span>
                        <button class="btn-copy-sm" onclick="copyTextToClipboard('${data.data}', this)">Copy</button>
                    </div>
                </td>
            `;
            historyBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading history:", error);
        loadingDiv.style.display = 'none';
        loadingDiv.textContent = "Lỗi tải lịch sử.";
        // Tạm lờ lỗi index nếu có để hiện alert nhắc user
        if (error.code === 'failed-precondition') {
            // Index needed
            console.warn("Vui lòng tạo index trong Firebase Console theo đường dẫn trong log.");
        }
    }
}

// Hàm mua sản phẩm (Global)
// ... (existing code)

// Helper để tạo data test (Chạy trong Console: createTestOrders())
window.createTestOrders = async () => {
    if (typeof firebase === 'undefined') return console.error("Firebase chưa load");
    const auth = firebase.auth();
    const db = firebase.firestore();
    const user = auth.currentUser;
    if (!user) return alert("Vui lòng đăng nhập trước!");

    if (!confirm("Tạo 5 đơn hàng ảo để test?")) return;

    try {
        const batch = db.batch();
        const products = ["Netflix Premium", "Youtube Premium", "Spotify", "ChatGPT Plus"];

        for (let i = 0; i < 5; i++) {
            const ref = db.collection('accounts').doc();
            batch.set(ref, {
                product: products[Math.floor(Math.random() * products.length)],
                data: `user${i}:pass${i}|token_test_${Date.now()}`,
                status: "sold",
                soldAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // Random time in past
                buyerUid: user.uid,
                buyerEmail: user.email || "test@email.com",
                soldPrice: 50000 + i * 10000
            });
        }

        await batch.commit();
        alert("Đã tạo 5 đơn hàng mẫu! Hãy mở lại lịch sử.");
        if (document.getElementById('history-modal').classList.contains('show-modal')) {
            loadPurchaseHistory();
        }
    } catch (e) {
        console.error(e);
        alert("Lỗi: " + e.message);
    }
};
async function buyProduct(productName) {
    if (typeof firebase === 'undefined') {
        alert("Lỗi: Firebase chưa được tải.");
        return;
    }

    const auth = firebase.auth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert("Vui lòng đăng nhập để mua hàng!");
        openModal('login');
        return;
    }

    const db = firebase.firestore();
    const accountsRef = db.collection('accounts');
    const userRef = db.collection('users').doc(currentUser.uid);

    // Tìm giá sản phẩm
    const productInfo = localProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (!productInfo) {
        alert("Không tìm thấy thông tin sản phẩm!");
        return;
    }
    const price = Math.min(...productInfo.options.map(opt => opt.price));
    const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // 1. Lấy số dư hiện tại để hiển thị Confirm Modal
    try {
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            alert("Không tìm thấy thông tin người dùng!");
            return;
        }
        const userData = userDoc.data();
        const currentBalance = userData.balance || 0;

        if (currentBalance < price) {
            alert(`Số dư không đủ! (Cần ${priceFormatted}, hiện có ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBalance)})`);
            return;
        }

        // CONFIRM MODAL
        try {
            await showConfirmModal(productName, price, currentBalance);
        } catch (cancelled) {
            return; // User hủy
        }

        // 2. Tìm sản phẩm khả dụng
        const q = accountsRef.where('product', '==', productName.toLowerCase()).where('status', '==', 'available').limit(1);
        const querySnapshot = await q.get();
        if (querySnapshot.empty) {
            alert("Sản phẩm này hiện đã hết hàng.");
            return;
        }
        const initialAccountDoc = querySnapshot.docs[0];
        const accountRef = initialAccountDoc.ref;

        // 3. Thực hiện Transaction
        await db.runTransaction(async (transaction) => {
            // Re-check balance
            const tUserDoc = await transaction.get(userRef);
            if (!tUserDoc.exists) throw "User không tồn tại";
            const tUserData = tUserDoc.data();
            const tBalance = tUserData.balance || 0;
            if (tBalance < price) throw "Số dư không đủ";

            // Re-check product
            const tAccountDoc = await transaction.get(accountRef);
            if (!tAccountDoc.exists) throw "Sản phẩm không còn";
            if (tAccountDoc.data().status !== 'available') throw "Vừa hết hàng";

            // Update
            const newBalance = tBalance - price;
            transaction.update(userRef, { balance: newBalance });
            transaction.update(accountRef, {
                status: 'sold',
                soldAt: new Date(),
                buyerUid: currentUser.uid,
                buyerEmail: currentUser.email || currentUser.providerData[0]?.email || "unknown",
                soldPrice: price
            });

            return { account: tAccountDoc.data().data, newBalance: newBalance };
        }).then((result) => {
            // SUCCESS MODAL
            showSuccessModal(result.account, result.newBalance);
        }).catch((error) => {
            console.error(error);
            alert("Giao dịch thất bại: " + error);
        });

    } catch (e) {
        console.error(e);
        alert("Lỗi: " + e.message);
    }
}
