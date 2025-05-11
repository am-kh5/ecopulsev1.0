"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, CloudDrizzle, Droplets, Zap, Leaf } from "lucide-react";
import { BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const company = { 
  name: "EcoCorp Inc.", 
  slogan: "Pioneering sustainable solutions for a greener tomorrow.", 
  avatarSrc: "https://picsum.photos/64/64?random=25", 
  dataAiHint: "company logo",
  avatarFallback: "EI" 
};

const kpiData = [
  { title: "Carbon Footprint", value: "1,250", unit: "tons CO2e", change: "-5.2%", trend: "down" as const, icon: Leaf, color: "hsl(var(--chart-1))" },
  { title: "CO2 Emissions", value: "800", unit: "tons CO2", change: "+2.1%", trend: "up" as const, icon: CloudDrizzle, color: "hsl(var(--chart-2))" },
  { title: "Water Waste", value: "15,000", unit: "m³", change: "-10%", trend: "down" as const, icon: Droplets, color: "hsl(var(--chart-3))" },
  { title: "Electricity Usage", value: "300,000", unit: "kWh", change: "-3%", trend: "down" as const, icon: Zap, color: "hsl(var(--chart-4))" },
];

const monthlyCarbonData = [
  { month: "Jan", footprint: 150, co2: 90 },
  { month: "Feb", footprint: 160, co2: 95 },
  { month: "Mar", footprint: 140, co2: 85 },
  { month: "Apr", footprint: 130, co2: 80 },
  { month: "May", footprint: 125, co2: 75 },
  { month: "Jun", footprint: 120, co2: 70 },
];

const carbonChartConfig = {
  footprint: {
    label: "Carbon Footprint (t CO2e)",
    color: "hsl(var(--chart-1))",
  },
  co2: {
    label: "CO2 Emissions (t CO2)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const monthlyUtilityData = [
  { month: "Jan", water: 1800, electricity: 35000 },
  { month: "Feb", water: 1700, electricity: 33000 },
  { month: "Mar", water: 1600, electricity: 32000 },
  { month: "Apr", water: 1550, electricity: 31000 },
  { month: "May", water: 1500, electricity: 30000 },
  { month: "Jun", water: 1450, electricity: 29000 },
];

const utilityChartConfig = {
  water: {
    label: "Water Waste (m³)",
    color: "hsl(var(--chart-3))",
  },
  electricity: {
    label: "Electricity (kWh)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={company.avatarSrc} alt={`${company.name} logo`} data-ai-hint={company.dataAiHint} />
            <AvatarFallback>{company.avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Welcome, {company.name}!</CardTitle>
            <CardDescription>{company.slogan}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-muted-foreground" style={{ color: kpi.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                {kpi.unit}
              </p>
              <div className={`text-xs mt-1 flex items-center ${kpi.trend === "down" ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                {kpi.trend === "down" ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
                {kpi.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Carbon Footprint & CO2 Emissions Overview</CardTitle>
            <CardDescription>Monthly trend for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={carbonChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={monthlyCarbonData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="footprint" fill="var(--color-footprint)" radius={4} />
                <Bar dataKey="co2" fill="var(--color-co2)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Utility Usage Overview</CardTitle>
            <CardDescription>Monthly water waste and electricity usage for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={utilityChartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={monthlyUtilityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <RechartsTooltip content={<ChartTooltipContent hideIndicator />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="water" stroke="var(--color-water)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="electricity" stroke="var(--color-electricity)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
