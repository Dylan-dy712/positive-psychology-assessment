interface ScatterChartProps {
  xScore: number;
  yScore: number;
  xLabel: string;
  yLabel: string;
  maxScore?: number;
}

export const ScatterChart = ({
  xScore,
  yScore,
  xLabel,
  yLabel,
  maxScore = 7,
}: ScatterChartProps) => {
  const midPoint = (maxScore + 1) / 2;
  const xPercent = (xScore / maxScore) * 100;
  const yPercent = ((maxScore - yScore) / maxScore) * 100;

  return (
    <div className="w-full py-4">
      <div className="relative w-full h-64 mx-auto" style={{ maxWidth: '280px' }}>
        {/* Y轴标签 */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-gray-600 whitespace-nowrap">
          {yLabel}
        </div>
        
        {/* X轴标签 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-sm text-gray-600">
          {xLabel}
        </div>

        {/* 坐标轴 */}
        <div className="absolute inset-4 border-2 border-gray-300">
          {/* 中线 */}
          <div
            className="absolute bg-gray-300"
            style={{
              left: `${(midPoint / maxScore) * 100}%`,
              top: 0,
              bottom: 0,
              width: '1px',
            }}
          />
          <div
            className="absolute bg-gray-300"
            style={{
              top: `${((maxScore - midPoint) / maxScore) * 100}%`,
              left: 0,
              right: 0,
              height: '1px',
            }}
          />

          {/* 数据点 */}
          <div
            className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
            }}
          />
        </div>

        {/* 刻度 */}
        <div className="absolute bottom-0 left-4 right-4 flex justify-between text-xs text-gray-400">
          <span>1</span>
          <span>{midPoint}</span>
          <span>{maxScore}</span>
        </div>
        <div className="absolute top-4 bottom-4 left-0 flex flex-col justify-between text-xs text-gray-400">
          <span>{maxScore}</span>
          <span>{midPoint}</span>
          <span>1</span>
        </div>
      </div>
    </div>
  );
};
