document.addEventListener('DOMContentLoaded', async function() {
    const loginSection = document.getElementById('login-section');
    const registrationsSection = document.getElementById('registrations-section');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password'); // 获取密码显示/隐藏按钮
    const loginBtn = document.getElementById('login-btn');
    const loginErrorMessage = document.getElementById('login-error-message');
    const registrationsList = document.getElementById('registrationsList');
    const loadingMessage = document.getElementById('loadingMessage');
    const exportExcelBtn = document.getElementById('export-excel-btn'); // 获取导出按钮
    const logoutBtn = document.getElementById('logout-btn'); // 获取退出登录按钮

    const BACKEND_URL = 'https://lazy-otters-pump.loca.lt'; // 后端服务地址

    // 从sessionStorage获取token
    let authToken = sessionStorage.getItem('authToken');

    async function loadRegistrations(token) {
        registrationsSection.style.display = 'block'; // 显示报名信息区域
        loginSection.style.display = 'none'; // 隐藏登录区域
        loadingMessage.style.display = 'block'; // 显示加载消息
        registrationsList.innerHTML = ''; // 清空列表

        try {
            const response = await fetch(`${BACKEND_URL}/registrations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                // Token无效或过期，需要重新登录
                alert('认证失败，请重新登录。');
                sessionStorage.removeItem('authToken'); // 清除无效token
                showLogin();
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const registrations = await response.json();

            loadingMessage.style.display = 'none'; // 隐藏加载消息

            if (registrations.length === 0) {
                registrationsList.innerHTML = '<li class="empty-message">暂无报名信息。</li>';
            } else {
                registrations.forEach(reg => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span class="name">${reg.name}</span>
                        <span class="contact">${reg.contact}</span>
                        <span class="time">${new Date(reg.timestamp).toLocaleString()}</span>
                    `;
                    registrationsList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('获取报名信息失败:', error);
            loadingMessage.textContent = '加载报名信息失败，请检查后端服务是否运行或认证是否正确。';
            loadingMessage.style.color = 'red';
        }
    }

    async function handleLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        loginErrorMessage.style.display = 'none'; // 隐藏错误消息

        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                authToken = result.token;
                sessionStorage.setItem('authToken', authToken); // 保存token
                loadRegistrations(authToken); // 登录成功后加载报名信息
            } else {
                loginErrorMessage.textContent = result.message || '登录失败，请检查用户名和密码。'
                loginErrorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            loginErrorMessage.textContent = '登录请求失败，请检查后端服务。'
            loginErrorMessage.style.display = 'block';
        }
    }

    function showLogin() {
        loginSection.style.display = 'block';
        registrationsSection.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
        loginErrorMessage.style.display = 'none';
    }

    // 新增退出登录函数
    function handleLogout() {
        sessionStorage.removeItem('authToken'); // 清除token
        authToken = null; // 重置authToken变量
        showLogin(); // 显示登录界面
        alert('已成功退出登录。');
    }

    // 处理导出 Excel
    async function handleExport() {
        if (!authToken) {
            alert('请先登录才能导出数据。');
            return;
        }

        try {
            // 直接通过 window.open 或创建a标签进行下载
            // fetch方式下载文件并设置Authorization头
            const response = await fetch(`${BACKEND_URL}/export-registrations`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                alert('认证失败，无法导出数据，请重新登录。');
                sessionStorage.removeItem('authToken');
                showLogin();
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'registrations.csv'; // 文件名
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出数据失败，请检查后端服务或网络连接。 ');
        }
    }


    // 页面加载时不再检查是否已登录，直接显示登录界面
    showLogin();

    // 登录按钮点击事件
    loginBtn.addEventListener('click', handleLogin);

    // 导出 Excel 按钮点击事件
    exportExcelBtn.addEventListener('click', handleExport);

    // 退出登录按钮点击事件
    logoutBtn.addEventListener('click', handleLogout);

    // 密码显示/隐藏按钮点击事件
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
});
