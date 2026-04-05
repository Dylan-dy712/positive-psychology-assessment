// 静态文件服务器（带API代理）
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 静态文件目录
const staticDir = path.join(__dirname, 'dist');

// 后端API地址
const API_TARGET = 'http://localhost:3001';

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif'
};

// 创建服务器
const server = http.createServer((req, res) => {
  // 检查是否是API请求
  if (req.url.startsWith('/api')) {
    // 转发API请求到后端服务
    const targetUrl = `${API_TARGET}${req.url}`;
    const parsedUrl = url.parse(targetUrl);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: req.method,
      headers: {
        ...req.headers,
        host: 'localhost:3001'
      }
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      // 设置CORS头
      res.writeHead(proxyRes.statusCode, {
        ...proxyRes.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      
      // 转发响应数据
      proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (err) => {
      console.error('代理请求错误:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '后端服务连接失败' }));
    });
    
    // 转发请求数据
    req.pipe(proxyReq);
    return;
  }
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }
  
  // 解析请求路径
  let filePath = path.join(staticDir, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  
  // 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，返回index.html（支持SPA路由）
      filePath = path.join(staticDir, 'index.html');
    }
    
    // 读取文件
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
        return;
      }
      
      // 设置Content-Type
      const extname = path.extname(filePath);
      const contentType = mimeTypes[extname] || 'application/octet-stream';
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content, 'utf-8');
    });
  });
});

// 启动服务器
const PORT = 8081;
server.listen(PORT, () => {
  console.log(`静态文件服务器已启动`);
  console.log(`访问地址: http://localhost:${PORT}`);
  console.log(`API代理地址: http://localhost:${PORT}/api`);
  console.log(`后端服务地址: ${API_TARGET}`);
  console.log(`按 Ctrl+C 停止服务器`);
});
