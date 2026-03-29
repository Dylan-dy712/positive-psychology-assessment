import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGratitudeDiaries } from '../utils/storage';

export const GratitudeCalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    // 确保使用本地时间，避免时区问题
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [diaries, setDiaries] = useState<any[]>([]);
  const [selectedDiaries, setSelectedDiaries] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const allDiaries = getGratitudeDiaries();
    setDiaries(allDiaries);
  }, []);

  useEffect(() => {
    // 查找选中日期的所有日记
    const dateDiaries = diaries.filter((d: { date: string }) => d.date === selectedDate);
    setSelectedDiaries(dateDiaries);
  }, [selectedDate, diaries]);

  // 处理照片点击，放大查看
  const handlePhotoClick = (e: React.MouseEvent, photo: string) => {
    e.stopPropagation();
    setPreviewPhoto(photo);
    setShowPreview(true);
  };

  // 生成日历
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      currentWeek.push(new Date(d));
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weeks;
  };

  // 检查日期是否有日记
  const hasDiary = (date: Date) => {
    const dateString = formatDate(date);
    return diaries.some((d: { date: string }) => d.date === dateString);
  };

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 处理日期选择
  const handleDateSelect = (date: Date) => {
    setSelectedDate(formatDate(date));
  };

  // 切换月份
  const changeMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="bg-[#FFA203] text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/mental-save/gratitude-diary')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">感恩日记</h1>
          <div className="w-8"></div> {/* 占位，保持标题居中 */}
        </div>
        <p className="text-sm opacity-90">记录每天值得感恩的事物，培养积极心态</p>
      </div>

      {/* 日历选择器 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-bold">
            {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
          </h2>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* 日历格子 */}
        <div className="grid grid-cols-7 gap-2">
          {generateCalendar().map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dateIndex) => {
                const isToday = formatDate(date) === formatDate(new Date());
                const isSelected = formatDate(date) === selectedDate;
                const hasDiaryEntry = hasDiary(date);
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

                return (
                  <button
                    key={dateIndex}
                    onClick={() => handleDateSelect(date)}
                    className={`aspect-square flex items-center justify-center rounded-full transition-colors ${
                      isSelected 
                        ? 'bg-[#FFA203] text-white'
                        : isToday
                          ? 'bg-blue-100 text-blue-600'
                          : isCurrentMonth
                            ? 'text-gray-800 hover:bg-gray-100'
                            : 'text-gray-300'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      {date.getDate()}
                      {hasDiaryEntry && (
                        <img src="/positive-psychology-assessment/assets/aixin.svg" alt="有记录" className="w-6 h-5 mt-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 日记内容展示 */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-lg font-bold mb-3">{selectedDate}的感恩日记</h3>
        {selectedDiaries.length > 0 ? (
          <div className="space-y-4">
            {selectedDiaries.map((diary, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FFA203] text-white text-xs px-2 py-1 rounded-full">
                    记录 {index + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {diary.type === 'three-question' ? '感恩三问' : '自由记录'}
                  </span>
                </div>
                {diary.type === 'three-question' ? (
                  <div className="space-y-3">
                    <p><strong>1. 今天，我感谢的人是？</strong> {diary.content.q1}</p>
                    <p><strong>2. 因为？</strong> {diary.content.q2}</p>
                    <p><strong>3. 今天，我感恩的一件事是？</strong> {diary.content.q3}</p>
                    <p><strong>4. 它让我感到？</strong> {diary.content.q4}</p>
                    <p><strong>5. 今天，一个让我感到温暖/幸运的瞬间是？</strong> {diary.content.q5}</p>
                  </div>
                ) : (
                  <div>
                    <p>{diary.content}</p>
                    {diary.photo && (
                      <div className="mt-3">
                        <img 
                          src={diary.photo} 
                          alt="感恩照片" 
                          className="w-full max-h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => handlePhotoClick(e, diary.photo)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            该日期暂无感恩日记记录
          </p>
        )}
      </div>

      {/* 图片预览模态框 */}
      {showPreview && previewPhoto && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={previewPhoto} 
              alt="预览" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-black"
              onClick={() => setShowPreview(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};