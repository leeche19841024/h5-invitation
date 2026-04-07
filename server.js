
const express = require('express');
const cors = require('cors');
const { Parser } = require('json2csv'); // 引入 json2csv

const app = express();
const PORT = 3000; // 后端服务运行在3000端口

// 内存存储（用于Vercel Serverless环境）
let registrations = [];
const users = [{"username": "admin", "password": "admin123"}];

// 硬编码的秘密令牌，用于身份验证。在实际应用中应使用JWT等更安全的机制。
const SECRET_TOKEN = 'your_super_secret_admin_token'; // 请替换为更复杂的字符串

// 中间件
app.use(cors()); // 允许所有跨域请求
app.use(express.json()); // 解析JSON格式的请求体

// 身份验证中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.status(401).json({ message: '未提供认证令牌' });

    if (token === SECRET_TOKEN) { // 简单验证令牌
        next();
    } else {
        res.status(403).json({ message: '认证令牌无效' });
    }
}

// API路由：接收报名信息
app.post('/register', (req, res) => {
    const { name, contact } = req.body;

    if (!name || !contact) {
        return res.status(400).json({ message: '姓名和手机号码为必填项。' });
    }

    try {
        const newRegistration = { name, contact, timestamp: new Date().toISOString() };
        registrations.push(newRegistration);
        res.status(200).json({ message: '报名成功！', data: newRegistration });
    } catch (error) {
        console.error('保存报名信息失败:', error);
        res.status(500).json({ message: '服务器内部错误，报名失败。' });
    }
});

// API路由：用户登录
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const user = users.find(u => u.username === username && u.password === password); // 简单比对密码

        if (user) {
            // 在实际应用中，这里应该生成一个JWT
            res.json({ message: '登录成功', token: SECRET_TOKEN });
        } else {
            res.status(401).json({ message: '用户名或密码错误' });
        }
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// API路由：获取所有报名信息 (受保护)
app.get('/registrations', authenticateToken, (req, res) => {
    try {
        // 添加缓存控制头，防止浏览器缓存
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.status(200).json(registrations);
    } catch (error) {
        console.error('获取报名信息失败:', error);
        res.status(500).json({ message: '服务器内部错误，获取报名信息失败。' });
    }
});

// 新增 API 路由：导出报名信息为 CSV (受保护)
app.get('/export-registrations', authenticateToken, (req, res) => {
    try {
        // 定义 CSV 字段
        const fields = [
            {
                label: '姓名',
                value: 'name'
            },
            {
                label: '手机号码',
                value: 'contact'
            },
            {
                label: '报名时间',
                value: 'timestamp',
                // 格式化时间戳
                formatter: (value) => {
                    if (!value) return '';
                    const date = new Date(value);
                    const year = date.getFullYear();
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const seconds = date.getSeconds().toString().padStart(2, '0');
                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                }
            }
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(registrations);

        // 添加 UTF-8 BOM
        const csvWithBOM = '\ufeff' + csv;

        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment('registrations.csv');
        res.send(csvWithBOM); // 发送带 BOM 的 CSV 数据
    } catch (error) {
        console.error('导出报名信息失败:', error);
        res.status(500).json({ message: '服务器内部错误，导出失败。' });
    }
});


// 启动服务器
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`报名后端服务正在运行，监听端口 ${PORT}`);
        console.log(`访问 http://localhost:${PORT} 以测试`);
    });
}

// 导出app供Vercel使用
module.exports = app;
