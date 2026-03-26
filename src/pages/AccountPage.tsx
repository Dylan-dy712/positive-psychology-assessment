import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { getUserData, saveUserData } from '../utils/user';
import { Toast } from '../components/Toast';

const schoolStages = ['小学', '初中', '高中', '大学'];
const gradesByStage: Record<string, string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['初一', '初二', '初三'],
  '高中': ['高一', '高二', '高三'],
  '大学': ['大一', '大二', '大三', '大四', '研究生'],
};

export const AccountPage = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  
  const [nickname, setNickname] = useState(userData.nickname);
  const [age, setAge] = useState(userData.age?.toString() || '');
  const [gender, setGender] = useState(userData.gender);
  const [schoolStage, setSchoolStage] = useState(userData.schoolStage || '');
  const [grade, setGrade] = useState(userData.grade || '');
  const [avatar, setAvatar] = useState(userData.avatar);
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    saveUserData({
      avatar,
      nickname,
      age: age ? parseInt(age) : undefined,
      gender: gender as 'male' | 'female' | 'unknown',
      schoolStage,
      grade,
    });
    
    setToastMessage('保存成功');
    setShowToast(true);
  };

  return (
    <div className="page-container pb-24">
      <div className="sticky top-0 bg-background z-10 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      <div className="px-4 pb-6">
        <h1 className="text-xl font-bold text-primary mb-6 text-center">账号信息</h1>

        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center">
            <img
              src={avatar}
              alt="头像"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-input"
            />
            <label
              htmlFor="avatar-input"
              className="text-primary text-sm font-medium cursor-pointer"
            >
              更换头像
            </label>
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2">昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              placeholder="请输入昵称"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2">年龄</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
              placeholder="请输入年龄"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2">性别</label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                  gender === 'male'
                    ? 'border-primary text-primary'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                男
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                  gender === 'female'
                    ? 'border-primary text-primary'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                女
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2">学段</label>
            <div className="flex flex-wrap gap-2">
              {schoolStages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => {
                    setSchoolStage(stage);
                    setGrade('');
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    schoolStage === stage
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {schoolStage && (
            <div>
              <label className="block text-gray-600 text-sm mb-2">年级</label>
              <div className="flex flex-wrap gap-2">
                {gradesByStage[schoolStage].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      grade === g
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 py-4 bg-primary text-white rounded-full font-bold text-lg"
        >
          保存
        </button>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};
