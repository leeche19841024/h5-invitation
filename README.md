# H5 活动邀请函部署说明

本项目是一个纯静态的H5页面，因此部署非常简单。您可以将项目文件上传到任何支持静态网站托管的平台。

## 文件结构

```
/
├── index.html   (主页面)
├── style.css    (样式表)
└── script.js    (脚本文件)
```

## 部署步骤

您可以选择以下任一方式进行部署：

### 1. 使用 GitHub Pages

1.  创建一个新的 GitHub 仓库。
2.  将 `index.html`, `style.css`, 和 `script.js` 文件上传到该仓库。
3.  进入仓库的 **Settings** > **Pages** 页面。
4.  在 **Source** 部分，选择 `main` (或 `master`) 分支，然后点击 **Save**。
5.  GitHub 将会自动为您生成一个公开的网址，例如 `https://your-username.github.io/your-repo-name/`。

### 2. 使用 Netlify、Vercel 或其他静态托管服务

这些平台通常提供拖放式部署：

1.  注册并登录到您选择的平台（如 [Netlify](https://www.netlify.com/) 或 [Vercel](https://vercel.com/)）。
2.  将包含 `index.html`, `style.css`, `script.js` 的文件夹直接拖放到平台的部署区域。
3.  平台会自动处理并为您提供一个可访问的URL。

### 3. 部署到自己的服务器

如果您有自己的服务器（例如 Nginx 或 Apache）：

1.  将 `index.html`, `style.css`, 和 `script.js` 文件上传到服务器的网站根目录（例如 `/var/www/html`）。
2.  确保服务器已正确配置以提供静态文件服务。
3.  通过服务器的IP地址或域名即可访问该页面。

## 注意事项

*   **报名数据**：当前的报名功能仅在前端通过 `alert` 提示用户报名成功，并不会将数据发送到后端服务器。如果需要收集报名信息，您需要：
    1.  开发一个后端API来接收和存储数据。
    2.  修改 `script.js` 中的 `rsvpForm` 事件监听器，使用 `fetch` 或 `axios` 将表单数据发送到您的API端点。
*   **分享功能**：分享功能依赖于 `navigator.share` API，该API仅在部分现代浏览器（尤其是移动端）和HTTPS环境下受支持。在不支持的环境下，会提示用户手动复制链接。