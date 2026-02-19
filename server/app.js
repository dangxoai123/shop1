const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Mapping product names to filenames
// Keys should match product.name from products.json, lowercased
const productFiles = {
    'chat gpt': 'chatgpt.txt',
    'grok ai': 'gtokai.txt',
    'telegram premium': 'Telegram Premium.txt',
    'youtube premium': 'Youtube Premium.txt',
    'capcut pro': 'CapCut Pro.txt',
    'capcut pro team': 'CapCut Pro Team.txt',
    'netflix 4k hdr': 'Netflix 4K HDR.txt',
    'veo3 credit': 'Veo3 Credit.txt'
    // 'tiktok': 'tiktok.txt' // Product not in JSON yet but file exists
};

const DATA_DIR = path.join(__dirname, '../fileacc');
const SOLD_DIR = path.join(__dirname, '../fileacc/sold');

// Ensure sold directory exists
if (!fs.existsSync(SOLD_DIR)) {
    fs.mkdirSync(SOLD_DIR, { recursive: true });
}

// Check stock API
app.get('/api/stock', (req, res) => {
    let stockInfo = {};
    const productNames = Object.keys(productFiles);

    productNames.forEach(prodName => {
        const fileName = productFiles[prodName];
        const filePath = path.join(DATA_DIR, fileName);
        const soldPath = path.join(SOLD_DIR, fileName);

        // Count available
        let availableCount = 0;
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                // Filter empty lines
                availableCount = data.split('\n').filter(line => line.trim() !== '').length;
            }
        } catch (e) { console.error(`Error reading stock for ${prodName}:`, e); }

        // Count sold
        let soldCount = 0;
        try {
            if (fs.existsSync(soldPath)) {
                const data = fs.readFileSync(soldPath, 'utf8');
                soldCount = data.split('\n').filter(line => line.trim() !== '').length;
            }
        } catch (e) {
            // It's okay if sold file doesn't exist yet
        }

        stockInfo[prodName] = { available: availableCount, sold: soldCount };
    });

    res.json(stockInfo);
});


// Buy API
app.get('/api/buy/:productName', (req, res) => {
    const productName = req.params.productName.toLowerCase();
    const fileName = productFiles[productName];

    console.log(`User buying: ${productName}, mapped to file: ${fileName}`);

    if (!fileName) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
    }

    const filePath = path.join(DATA_DIR, fileName);
    const soldPath = path.join(SOLD_DIR, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading stock file:', err);
            return res.status(500).json({ success: false, message: 'Lỗi đọc kho hàng.' });
        }

        let lines = data.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            return res.status(400).json({ success: false, message: 'Hết hàng.' });
        }

        // FIFO: Take the first account
        const account = lines[0];
        const remainingLines = lines.slice(1);

        // Write back remaining lines
        fs.writeFile(filePath, remainingLines.join('\n'), (writeErr) => {
            if (writeErr) {
                console.error('Error updating stock file:', writeErr);
                return res.status(500).json({ success: false, message: 'Lỗi cập nhật kho.' });
            }

            // Append to sold file
            // Check if sold file exists to determine if we need a newline prefix
            // Actually just append with newline is safest
            fs.appendFile(soldPath, account + '\n', (appendErr) => {
                if (appendErr) console.error('Error logging sold item:', appendErr);
            });

            console.log(`Sold account: ${account}`);
            res.json({ success: true, account: account });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
