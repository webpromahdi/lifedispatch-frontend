"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const defaultData = [
  { name: "P1 Resuscitation", value: 3, color: "#EF4444" },
  { name: "P2 Emergent", value: 5, color: "#F97316" },
  { name: "P3 Urgent", value: 7, color: "#EAB308" },
  { name: "P4 Less Urgent", value: 4, color: "#3B82F6" },
  { name: "P5 Non-Urgent", value: 2, color: "#64748B" },
];

interface PriorityPieChartProps {
  data?: typeof defaultData;
}

export function PriorityPieChart({
  data = defaultData,
}: PriorityPieChartProps) {
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E2E8F0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
