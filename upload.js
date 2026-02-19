const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

// *** CẤU HÌNH FIREBASE ***
// Copy từ file firebase-config.js của bạn
const firebaseConfig = {
    apiKey: "AIzaSyC1WM1AfrjCY2JvJolwS62ndRPTaddwbMc",
    authDomain: "duanmxh1.firebaseapp.com",
    projectId: "duanmxh1",
    storageBucket: "duanmxh1.firebasestorage.app",
    messagingSenderId: "637349172653",
    appId: "1:637349172653:web:9fcf4758df64155f2afd24"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mapping tên file -> Tên sản phẩm trên Firestore
const productFiles = {
    'chatgpt.txt': 'chat gpt',
    'gtokai.txt': 'grok ai',
    'Telegram Premium.txt': 'telegram premium',
    'Youtube Premium.txt': 'youtube premium',
    'CapCut Pro.txt': 'capcut pro',
    'CapCut Pro Team.txt': 'capcut pro team',
    'Netflix 4K HDR.txt': 'netflix 4k hdr',
    'Veo3 Credit.txt': 'veo3 credit',
    'tiktok.txt': 'tiktok'
};

const DATA_DIR = path.join(__dirname, 'fileacc');

async function uploadData() {
    console.log("Bắt đầu đồng bộ dữ liệu...");

    for (const [fileName, productName] of Object.entries(productFiles)) {
        const filePath = path.join(DATA_DIR, fileName);

        if (!fs.existsSync(filePath)) {
            console.log(`[BỎ QUA] File không tồn tại: ${fileName}`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        // Filter empty lines
        const accounts = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        if (accounts.length === 0) {
            console.log(`[TRỐNG] ${fileName} không có tài khoản.`);
            continue;
        }

        console.log(`Đang xử lý ${productName} (${accounts.length} tài khoản)...`);

        // Lấy danh sách tài khoản hiện có trên Firestore để tránh trùng lặp
        const q = query(collection(db, "accounts"), where("product", "==", productName));
        let querySnapshot;
        try {
            querySnapshot = await getDocs(q);
        } catch (err) {
            console.error(`[LỖI] Không thể đọc dữ liệu cho ${productName}. Truy cập bị từ chối hoặc lỗi mạng.`);
            console.error(`Chi tiết: ${err.message}`);
            continue; // Bỏ qua sản phẩm này và đi tiếp
        }

        const existingAccounts = new Set();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            existingAccounts.add(data.data); // data.data là chuỗi tài khoản user|pass
        });

        let addedCount = 0;
        for (const acc of accounts) {
            if (!existingAccounts.has(acc)) {
                try {
                    await addDoc(collection(db, "accounts"), {
                        product: productName,
                        data: acc,
                        status: 'available',
                        createdAt: new Date()
                    });
                    addedCount++;
                    process.stdout.write('.');
                } catch (e) {
                    console.error(`Lỗi thêm account: ${acc}`, e);
                }
            } else {
                // Đã tồn tại, bỏ qua
            }
        }
        console.log(`\n[HOÀN TẤT] ${productName}: Thêm mới ${addedCount} tài khoản.`);
    }
    console.log("Đồng bộ hoàn tất! Nhấn Ctrl+C để thoát nếu cần.");
}

uploadData();
