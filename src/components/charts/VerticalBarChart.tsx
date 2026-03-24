interface VerticalBarChartProps {
  data: {
    dimension: string;
    score: number;
    maxScore: number;
  }[];
  color?: string;
}

export const VerticalBarChart = ({ data, color = '#F97316' }: VerticalBarChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.maxScore));

  return (
    <div className="w-full py-4 px-4">
      <div className="flex items-end justify-center gap-8 h-48">
        {data.map((item, index) => {
          const percentage = (item.score / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="text-lg font-bold text-gray-700">{item.score}</div>
              <div
                className="w-16 rounded-t-lg transition-all duration-500"
                style={{
                  height: `${percentage * 1.5}px`,
                  backgroundColor: color,
                  minHeight: '20px',
                }}
              />
              <div className="text-sm text-gray-600 text-center">{item.dimension}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span>平均值</span>
        </div>
      </div>
    </div>
  );
};
