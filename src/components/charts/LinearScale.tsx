interface LinearScaleProps {
  score: number;
  minScore: number;
  maxScore: number;
  label?: string;
}

export const LinearScale = ({ score, minScore, maxScore, label }: LinearScaleProps) => {
  const percentage = ((score - minScore) / (maxScore - minScore)) * 100;

  return (
    <div className="w-full py-6">
      {label && (
        <p className="text-center text-gray-700 mb-4 text-lg">
          {label}
          <span className="text-red-500 font-bold text-2xl ml-2">{score}</span>
          <span className="text-gray-500 text-base">分</span>
        </p>
      )}
      <div className="relative h-4 bg-gray-200 rounded-full mx-4">
        <div
          className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-md transition-all duration-500"
          style={{ left: `calc(${percentage}% - 12px)` }}
        />
      </div>
      <div className="flex justify-between px-4 mt-2 text-sm text-gray-500">
        <span>{minScore}</span>
        <span>{maxScore}</span>
      </div>
    </div>
  );
};
