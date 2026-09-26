"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const defaultData = [
  { time: "00:00", emergencies: 4, resolved: 3 },
  { time: "04:00", emergencies: 2, resolved: 2 },
  { time: "08:00", emergencies: 11, resolved: 9 },
  { time: "12:00", emergencies: 18, resolved: 16 },
  { time: "16:00", emergencies: 15, resolved: 14 },
  { time: "20:00", emergencies: 12, resolved: 11 },
  { time: "23:59", emergencies: 6, resolved: 5 },
];

interface EmergencyLineChartProps {
  data?: typeof defaultData;
}

export function EmergencyLineChart({
  data = defaultData,
}: EmergencyLineChartProps) {
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
            vertical={false}
          />
          <XAxis
            dataKey="time"
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
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E2E8F0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
            labelStyle={{ fontWeight: "600", color: "#0F172A" }}
          />
          <Line
            type="monotone"
            dataKey="emergencies"
            name="Emergency Calls"
            stroke="#14B8A6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#14B8A6", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#0D9488" }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            name="Dispatched & Handed Over"
            stroke="#6366F1"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: "#6366F1" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
