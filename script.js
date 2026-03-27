
document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvp-form');
    const shareBtn = document.getElementById('share-btn');



    // 报名表单提交
    rsvpForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;

        if (name && contact) {
            alert(`感谢您的报名，${name}！我们已收到您的信息，期待您的光临。`);
            rsvpForm.reset();
        } else {
            alert('请填写您的姓名和联系方式。');
        }
    });

    // 分享按钮点击
    shareBtn.addEventListener('click', function() {
        if (navigator.share) {
            // 在支持的非微信浏览器中，使用Web Share API
            navigator.share({
                title: '诚邀您参加我们的活动',
                text: '一场关于H5技术交流与实践的分享会，期待您的参与！',
                url: window.location.href
            }).then(() => {
                console.log('感谢分享！');
            }).catch(console.error);
        } else {
            // 在其他不支持分享的浏览器中，或在微信内置浏览器中，提示手动分享
            alert('您的浏览器不支持自动分享功能，请手动复制链接分享。');
        }
    });
});