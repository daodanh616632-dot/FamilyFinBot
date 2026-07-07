const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 5500;
const FILE = path.join(__dirname, 'SMM_Order_Tool.html');

// Kiểm tra file HTML có tồn tại không
if (!fs.existsSync(FILE)) {
    console.log('============================================');
    console.log('   LOI: Khong tim thay file SMM_Order_Tool.html');
    console.log('   File phai nam cung thu muc voi server.js');
    console.log('============================================');
    process.exit(1);
}

// Lấy IP local
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push({ name, ip: iface.address });
            }
        }
    }
    return ips;
}

const server = http.createServer((req, res) => {
    // Cho phep moi noi goi API tu HTML
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Luon tra ve file HTML cho MOI duong dan
    fs.readFile(FILE, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Loi doc file HTML');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('============================================');
    console.log('   SMM TOOL SERVER - Facebook Cam Xuc');
    console.log('============================================');
    console.log('');
    console.log('   Server dang chay thanh cong!');
    console.log('');
    console.log('   Mo dien thoai (cung WiFi) trinh duyet len');
    console.log('   va nhap dia chi ben duoi:');
    console.log('');
    
    const ips = getLocalIPs();
    if (ips.length === 0) {
        console.log('   >> http://192.168.1.10:5500');
        console.log('');
        console.log('   (Khong tim thay IP tu dong, dung IP mac dinh)');
    } else {
        for (const { name, ip } of ips) {
            if (ip.startsWith('192.168') || ip.startsWith('10.')) {
                console.log('   >> http://' + ip + ':' + PORT + '  (' + name + ')');
            }
        }
        console.log('');
        for (const { name, ip } of ips) {
            if (!ip.startsWith('192.168') && !ip.startsWith('10.')) {
                console.log('   >> http://' + ip + ':' + PORT + '  (' + name + ')');
            }
        }
    }
    
    console.log('');
    console.log('   CHI CAN GO DUNG: http://[IP]:5500');
    console.log('   Khong can them ten file phia sau');
    console.log('');
    console.log('============================================');
    console.log('   Nhan Ctrl + C de dung server');
    console.log('============================================');
    console.log('');
});
