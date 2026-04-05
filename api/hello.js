// Vercel Serverless Function - 健康检查
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
}
