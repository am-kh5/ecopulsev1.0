
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, CloudDrizzle, Droplets, Zap, Leaf, Wind, Waves } from "lucide-react";
import { BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip, Bar, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
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
  { title: "Air Quality (AQI)", value: "42", unit: "AQI", change: "-2.0%", trend: "down" as const, icon: Wind, color: "hsl(var(--chart-5))" },
  { title: "Water Quality (WQI)", value: "75", unit: "WQI", change: "+1.5%", trend: "up" as const, icon: Waves, color: "hsl(var(--chart-3))" }, // Reusing chart-3 color
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

const aqiGaugeData = [{ name: "AQI", value: 42 }];
const wqiGaugeData = [{ name: "WQI", value: 75 }];

const qualityGaugeChartConfig = {
  aqi: {
    label: "AQI",
    color: "hsl(var(--chart-5))", // Green-ish for good AQI
  },
  wqi: {
    label: "WQI",
    color: "hsl(var(--chart-3))", // Blue for water
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <div className={`text-xs mt-1 flex items-center ${kpi.trend === "down" ? "text-[hsl(var(--success))]" : kpi.trend === "up" && (kpi.title === "CO2 Emissions") ? "text-destructive" : "text-[hsl(var(--success))]" }`}>
                 {kpi.trend === "down" ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
                {kpi.change} vs last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Air Quality Index (AQI)</CardTitle>
            <CardDescription>Nearby air quality. Lower is better (0-50 Good).</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ChartContainer config={qualityGaugeChartConfig} className="h-[250px] w-[250px]">
              <RadialBarChart
                data={aqiGaugeData}
                startAngle={180} // Start from the left
                endAngle={0} // End at the right (top semi-circle)
                innerRadius="60%"
                outerRadius="100%"
                barSize={35}
                cx="50%"
                cy="70%" // Adjust to make space for label below
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value"
                  name="aqi"
                  angleAxisId={0}
                  fill="var(--color-aqi)"
                  cornerRadius={10}
                />
                 <RechartsTooltip content={<ChartTooltipContent hideLabel indicator="line" nameKey="name" />} />
                <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-4xl font-bold">
                  {aqiGaugeData[0].value}
                </text>
                <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                  AQI
                </text>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Water Quality Index (WQI)</CardTitle>
            <CardDescription>Nearby water quality. Higher is better (0-100 scale).</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
             <ChartContainer config={qualityGaugeChartConfig} className="h-[250px] w-[250px]">
              <RadialBarChart
                data={wqiGaugeData}
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="100%"
                barSize={35}
                cx="50%"
                cy="70%"
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value"
                  name="wqi"
                  angleAxisId={0}
                  fill="var(--color-wqi)"
                  cornerRadius={10}
                />
                <RechartsTooltip content={<ChartTooltipContent hideLabel indicator="line" nameKey="name" />} />
                 <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-4xl font-bold">
                  {wqiGaugeData[0].value}
                </text>
                <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                  WQI
                </text>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

