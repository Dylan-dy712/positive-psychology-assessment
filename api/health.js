// Vercel Serverless Function - 健康检查
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: process.env.USE_TCB === 'true' ? 'TCB云数据库' : '内存数据库'
  });
}
