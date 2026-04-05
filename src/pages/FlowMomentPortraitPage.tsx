import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFlowMoments } from '../utils/storage';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const FlowMomentPortraitPage = () => {
  const navigate = useNavigate();
  const [flowData, setFlowData] = useState({
    count: 0,
    totalHours: 0,
    topActivities: [] as { name: string; count: number; percentage: number }[],
    durationDistribution: [] as { name: string; value: number }[],
    topTriggers: [] as { name: string; count: number; percentage: number }[],
  });

  useEffect(() => {
    calculateFlowData();
  }, []);

  const calculateFlowData = () => {
    const moments = getFlowMoments();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 筛选近30天的数据
    const recentMoments = moments.filter(moment => {
      return new Date(moment.date) >= thirtyDaysAgo;
    });

    // 计算心流次数
    const totalCount = recentMoments.length;

    // 计算累计专注时长
    const totalHours = recentMoments.reduce((total, moment) => {
      switch (moment.duration) {
        case '15-30分钟': return total + 0.35;
        case '30分-1小时': return total + 0.75;
        case '1-2小时': return total + 1.5;
        case '2小时以上': return total + 2;
        default: return total;
      }
    }, 0);

    // 统计高频活动
    const activityCount: Record<string, number> = {};
    recentMoments.forEach(moment => {
      moment.activities.forEach(activity => {
        activityCount[activity] = (activityCount[activity] || 0) + 1;
      });
    });

    // 排序并取前2个
    const topActivities = Object.entries(activityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([activity, count]) => ({
        name: activity,
        count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }));

    // 统计时长分布
    const durationCount: Record<string, number> = {
      '15-30分钟': 0,
      '30分-1小时': 0,
      '1-2小时': 0,
      '2小时以上': 0,
    };

    recentMoments.forEach(moment => {
      if (durationCount[moment.duration] !== undefined) {
        durationCount[moment.duration]++;
      }
    });

    const durationDistribution = Object.entries(durationCount).map(([name, value]) => ({
      name,
      value,
    }));

    // 统计触发条件
    const triggerCount: Record<string, number> = {};
    recentMoments.forEach(moment => {
      moment.triggers.forEach(trigger => {
        triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
      });
    });

    // 排序并取前2个
    const topTriggers = Object.entries(triggerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([trigger, count]) => ({
        name: trigger,
        count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }));

    setFlowData({
      count: totalCount,
      totalHours: Number(totalHours.toFixed(1)),
      topActivities,
      durationDistribution,
      topTriggers,
    });
  };

  // 饼图颜色
  const COLORS = ['#FFA203', '#FFD166', '#06D6A0', '#118AB2'];

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="bg-[#FFA203] text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => navigate('/mental-save/flow-moment')}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">心流画像</h1>
          <div className="w-8"></div> {/* 占位，保持标题居中 */}
        </div>
        <p className="text-sm opacity-90">记录专注投入的快乐时光，发现你的心流模式</p>
      </div>

      {/* 心流统计模块 */}
      <div className="p-5">
        <div className="bg-gray-50 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <img src="./assets/beibei.png" alt="心流画像" className="w-32 h-32 object-contain" />
            </div>
            <div className="text-right">
              <p className="text-gray-700">近30天 心流次数：<span className="text-red-600 font-bold text-lg">{flowData.count}次</span></p>
              <p className="text-gray-700 mt-2">累计专注时长：<span className="text-red-600 font-bold text-lg">{flowData.totalHours}小时</span></p>
            </div>
          </div>
        </div>

        {/* 高频心流活动 */}
        <div className="mt-5 bg-gray-50 rounded-xl p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-3">你最容易进入心流的是：</h3>
          <div className="space-y-3">
            {flowData.topActivities.map((activity: { name: string; percentage: number }, index: number) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{activity.name}</span>
                  <span className="text-sm font-medium">{activity.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FFA203] h-2 rounded-full" 
                    style={{ width: `${activity.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {flowData.topActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4">暂无数据</p>
            )}
          </div>
        </div>

        {/* 最佳心流时长 */}
        <div className="mt-5 bg-gray-50 rounded-xl p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-3">最佳心流时长</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flowData.durationDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {flowData.durationDistribution.map((_: { name: string; value: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 关键触发条件 */}
        <div className="mt-5 bg-gray-50 rounded-xl p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-3">帮你进入心流的TOP2条件：</h3>
          <div className="space-y-3">
            {flowData.topTriggers.map((trigger: { name: string; count: number; percentage: number }, index: number) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{trigger.name}</span>
                  <span className="text-sm font-medium">{trigger.count}次</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FFA203] h-2 rounded-full" 
                    style={{ width: `${trigger.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {flowData.topTriggers.length === 0 && (
              <p className="text-gray-500 text-center py-4">暂无数据</p>
            )}
          </div>
        </div>

        {/* 心流小贴士 */}
        <div className="mt-5 p-4 bg-yellow-50 rounded-xl">
          <p className="text-gray-700 text-center">✨ 心流时大脑会减少焦虑区域活动，让你感到平静又愉悦～</p>
        </div>
      </div>
    </div>
  );
};