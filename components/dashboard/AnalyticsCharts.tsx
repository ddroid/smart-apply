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

type ChartData = { name: string; value: number }[];

export function JobsFoundChart({ data }: { data: ChartData }) {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full h-full min-h-[300px]">
      <h2 className="text-base font-semibold text-text-primary mb-6">Jobs Found Over Time</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CompanyResearchChart({ data }: { data: ChartData }) {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full h-full min-h-[300px]">
      <h2 className="text-base font-semibold text-text-primary mb-6">Company Research Activity</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
            <Tooltip cursor={{ fill: "var(--color-surface-secondary)", opacity: 0.4 }} />
            <Bar dataKey="value" fill="var(--color-info)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MatchScoreChart({ data }: { data: ChartData }) {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.05),0px_1px_2px_0px_rgba(0,0,0,0.1)] w-full h-full min-h-[300px]">
      <h2 className="text-base font-semibold text-text-primary mb-6">Match Score Distribution</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-muted)" }} />
            <Tooltip cursor={{ fill: "var(--color-surface-secondary)", opacity: 0.4 }} />
            <Bar dataKey="value" fill="var(--color-success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
