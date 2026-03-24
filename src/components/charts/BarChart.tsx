interface BarChartProps {
  data: {
    dimension: string;
    score: number;
    maxScore: number;
  }[];
  color?: string;
}

export const BarChart = ({ data, color = '#F97316' }: BarChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.maxScore));

  return (
    <div className="w-full py-4 px-4">
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.score / maxValue) * 100;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-20 text-sm text-gray-600 text-right flex-shrink-0">
                {item.dimension}
              </div>
              <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                    minWidth: '40px',
                  }}
                >
                  <span className="text-white text-sm font-medium">{item.score}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-4 text-xs text-gray-400 pl-24">
        <span>0</span>
        <span>{maxValue}</span>
      </div>
    </div>
  );
};
