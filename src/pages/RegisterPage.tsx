import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表单验证
    if (!studentId || !password || !nickname) {
      setError('请填写所有字段');
      return;
    }

    if (studentId.length < 4) {
      setError('学号长度至少4位');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const result = await register(studentId, password, nickname);
      if (result.success) {
        console.log('注册成功:', result.user);
        navigate('/');
      } else {
        setError(result.error || '注册失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">心智</h1>
          <p className="text-gray-500 mt-1">创建您的账号</p>
        </div>

        {/* 注册表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">新用户注册</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="请输入学号（4-20位）"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">用于登录系统，建议使用真实学号</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                昵称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入昵称（2-10位）"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码（至少6位）"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">建议使用字母、数字组合</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          {/* 协议说明 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              点击"注册"即表示您同意
              <button
                onClick={() => navigate('/agreement/service')}
                className="text-blue-600 hover:text-blue-700 mx-1"
              >
                服务协议
              </button>
              和
              <button
                onClick={() => navigate('/agreement/privacy')}
                className="text-blue-600 hover:text-blue-700 mx-1"
              >
                隐私政策
              </button>
            </p>
          </div>

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <span className="text-gray-500">已有账号？</span>
            <button
              onClick={() => navigate('/login')}
              className="ml-1 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              立即登录
            </button>
          </div>
        </div>

        {/* 返回链接 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-600 transition-colors"
          >
            ← 返回
          </button>
        </div>
      </div>
    </div>
  );
};
