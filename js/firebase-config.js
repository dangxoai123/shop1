const firebaseConfig = {
    apiKey: "AIzaSyC1WM1AfrjCY2JvJolwS62ndRPTaddwbMc",
    authDomain: "duanmxh1.firebaseapp.com",
    projectId: "duanmxh1",
    storageBucket: "duanmxh1.firebasestorage.app",
    messagingSenderId: "637349172653",
    appId: "1:637349172653:web:9fcf4758df64155f2afd24",
    measurementId: "G-1G8C1FGCXE"
};

// Khởi tạo Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Analytics (tùy chọn)
    // if (firebase.analytics) { firebase.analytics(); }

    console.log("Firebase đã được kết nối!");
} else {
    console.error("Firebase SDK chưa được tải. Kiểm tra lại kết nối mạng hoặc file index.html");
}
