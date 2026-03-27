
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // 后端服务运行在3000端口

// 存储报名信息的JSON文件路径
const registrationsFilePath = path.join(__dirname, 'registrations.json');

// 中间件
app.use(cors()); // 允许所有跨域请求
app.use(express.json()); // 解析JSON格式的请求体

// 确保registrations.json文件存在，如果不存在则创建一个空数组
if (!fs.existsSync(registrationsFilePath)) {
    fs.writeFileSync(registrationsFilePath, JSON.stringify([], null, 2));
}

// API路由：接收报名信息
app.post('/register', (req, res) => {
    const { name, contact } = req.body;

    if (!name || !contact) {
        return res.status(400).json({ message: '姓名和手机号码为必填项。' });
    }

    try {
        const registrations = JSON.parse(fs.readFileSync(registrationsFilePath, 'utf8'));
        const newRegistration = { name, contact, timestamp: new Date().toISOString() };
        registrations.push(newRegistration);
        fs.writeFileSync(registrationsFilePath, JSON.stringify(registrations, null, 2));
        res.status(200).json({ message: '报名成功！', data: newRegistration });
    } catch (error) {
        console.error('保存报名信息失败:', error);
        res.status(500).json({ message: '服务器内部错误，报名失败。' });
    }
});

// API路由：获取所有报名信息
app.get('/registrations', (req, res) => {
    try {
        const registrations = JSON.parse(fs.readFileSync(registrationsFilePath, 'utf8'));
        res.status(200).json(registrations);
    } catch (error) {
        console.error('获取报名信息失败:', error);
        res.status(500).json({ message: '服务器内部错误，获取报名信息失败。' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`报名后端服务正在运行，监听端口 ${PORT}`);
    console.log(`访问 http://localhost:${PORT} 以测试`);
});
