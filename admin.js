document.addEventListener('DOMContentLoaded', async function() {
    const registrationsList = document.getElementById('registrationsList');
    const loadingMessage = document.getElementById('loadingMessage');

    try {
        const response = await fetch('http://localhost:3000/registrations');
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
        loadingMessage.textContent = '加载报名信息失败，请检查后端服务是否运行。';
        loadingMessage.style.color = 'red';
    }
});
