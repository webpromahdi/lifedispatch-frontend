"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const defaultData = [
  { status: "Pending", count: 3, color: "#F59E0B" },
  { status: "Assigned", count: 4, color: "#3B82F6" },
  { status: "En Route", count: 6, color: "#8B5CF6" },
  { status: "On Scene", count: 5, color: "#14B8A6" },
  { status: "Transporting", count: 4, color: "#06B6D4" },
  { status: "Handed Over", count: 8, color: "#22C55E" },
];

interface StatusBreakdownBarProps {
  data?: typeof defaultData;
}

export function StatusBreakdownBar({
  data = defaultData,
}: StatusBreakdownBarProps) {
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
            vertical={false}
          />
          <XAxis
            dataKey="status"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "#F1F5F9" }}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E2E8F0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" name="Incidents" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
