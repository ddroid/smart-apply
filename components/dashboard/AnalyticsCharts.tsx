"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const jobsFoundData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 45 },
  { name: "Wed", value: 32 },
  { name: "Thu", value: 58 },
  { name: "Fri", value: 85 },
  { name: "Sat", value: 35 },
  { name: "Sun", value: 10 },
];

export function JobsFoundChart() {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full h-full min-h-[300px]">
      <h2 className="text-base font-semibold text-text-primary mb-6">Jobs Found Over Time</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={jobsFoundData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8839ef" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#8839ef" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8839ef" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const researchData = [
  { name: "Mon", value: 2 },
  { name: "Tue", value: 5 },
  { name: "Wed", value: 3 },
  { name: "Thu", value: 8 },
  { name: "Fri", value: 12 },
  { name: "Sat", value: 4 },
  { name: "Sun", value: 1 },
];

export function CompanyResearchChart() {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full h-full min-h-[300px]">
      <h2 className="text-base font-semibold text-text-primary mb-6">Company Research Activity</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={researchData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
            <Tooltip cursor={{ fill: "var(--color-surface-secondary)", opacity: 0.4 }} />
            <Bar dataKey="value" fill="#1e66f5" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const scoreData = [
  { name: "50-60%", value: 5 },
  { name: "60-70%", value: 15 },
  { name: "70-80%", value: 45 },
  { name: "80-90%", value: 85 },
  { name: "90-100%", value: 35 },
];

export function MatchScoreChart() {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full h-full min-h-[300px]">
      <h2 className="text-base font-semibold text-text-primary mb-6">Match Score Distribution</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
            <Tooltip cursor={{ fill: "var(--color-surface-secondary)", opacity: 0.4 }} />
            <Bar dataKey="value" fill="#40a02b" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
