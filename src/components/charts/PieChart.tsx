import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const PieChart = ({ data }: PieChartProps) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ value }) => value}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};
