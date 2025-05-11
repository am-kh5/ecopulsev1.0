
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, CloudDrizzle, Droplets, Zap, Leaf, Wind, Waves, Sun, Recycle, Building, Plane, PackageIcon, Award } from "lucide-react";
import { BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip, Bar, RadialBarChart, RadialBar, PolarAngleAxis, PieChart, Pie, Cell } from "recharts";
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
  { title: "Air Quality (AQI)", value: "42", unit: "AQI", change: "-2.0%", trend: "down" as const, icon: Wind, color: "hsl(var(--success))" }, // Changed to success color for good AQI
  { title: "Water Quality (WQI)", value: "75", unit: "WQI", change: "+1.5%", trend: "up" as const, icon: Waves, color: "hsl(var(--chart-3))" },
  { title: "Renewable Energy", value: "65", unit: "% Mix", change: "+5%", trend: "up" as const, icon: Sun, color: "hsl(var(--chart-2))" }, 
  { title: "Recycling Rate", value: "70", unit: "%", change: "+3%", trend: "up" as const, icon: Recycle, color: "hsl(var(--chart-1))" },
  { title: "Leaderboard Points", value: "4,200", unit: "pts", change: "+50", trend: "up" as const, icon: Award, color: "hsl(var(--primary))" },
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
    icon: Leaf,
  },
  co2: {
    label: "CO2 Emissions (t CO2)",
    color: "hsl(var(--chart-2))",
    icon: CloudDrizzle,
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
    icon: Droplets,
  },
  electricity: {
    label: "Electricity (kWh)",
    color: "hsl(var(--chart-4))",
    icon: Zap,
  },
} satisfies ChartConfig;

const aqiGaugeData = [{ name: "AQI", value: 42, fill: "var(--color-aqi)" }];
const wqiGaugeData = [{ name: "WQI", value: 75, fill: "var(--color-wqi)" }];
const renewableEnergyGaugeData = [{ name: "Renewable", value: 65, fill: "var(--color-renewable)" }];
const recyclingRateGaugeData = [{ name: "Recycled", value: 70, fill: "var(--color-recycling)" }];


const sustainabilityGaugeChartConfig = {
  aqi: {
    label: "AQI",
    color: "hsl(var(--success))", // Green for good AQI
  },
  wqi: {
    label: "WQI",
    color: "hsl(var(--chart-3))", // Blue for water
  },
  renewable: {
    label: "Renewable Energy",
    color: "hsl(var(--chart-2))", // Orange for sun/energy
  },
  recycling: {
    label: "Recycling Rate",
    color: "hsl(var(--chart-1))", // Teal for recycling
  },
} satisfies ChartConfig;

const carbonSourceData = [
  { name: "Operations", value: 500, fill: "var(--color-operations)", icon: Building }, // 40% of 1250
  { name: "Travel & Logistics", value: 437.5, fill: "var(--color-travel)", icon: Plane }, // 35% of 1250
  { name: "Materials & Supply Chain", value: 312.5, fill: "var(--color-materials)", icon: PackageIcon }, // 25% of 1250
];

const carbonSourceChartConfig = {
  operations: { label: "Operations", color: "hsl(var(--chart-1))", icon: Building },
  travel: { label: "Travel & Logistics", color: "hsl(var(--chart-2))", icon: Plane },
  materials: { label: "Materials & Supply Chain", color: "hsl(var(--chart-4))", icon: PackageIcon }, 
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"> {/* Adjusted for 9 KPIs */}
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
              <div className={`text-xs mt-1 flex items-center ${
                // Specific logic for "good" trends (lower is better for these, higher for others)
                (kpi.trend === "down" && (kpi.title.includes("Footprint") || kpi.title.includes("Emissions") || kpi.title.includes("Waste") || kpi.title.includes("Usage") || kpi.title.includes("AQI"))) ? "text-[hsl(var(--success))]" : 
                (kpi.trend === "up" && (kpi.title.includes("WQI") || kpi.title.includes("Energy") || kpi.title.includes("Recycling") || kpi.title.includes("Points"))) ? "text-[hsl(var(--success))]" :
                "text-destructive" // Default to destructive for "bad" trends
              }`}>
                 {kpi.trend === "down" && (kpi.title.includes("Footprint") || kpi.title.includes("Emissions") || kpi.title.includes("Waste") || kpi.title.includes("Usage") || kpi.title.includes("AQI")) ? <TrendingDown className="h-4 w-4 mr-1" /> : 
                 kpi.trend === "up" && (kpi.title.includes("WQI") || kpi.title.includes("Energy") || kpi.title.includes("Recycling") || kpi.title.includes("Points")) ? <TrendingUp className="h-4 w-4 mr-1" /> : 
                 kpi.trend === "up" ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" /> 
                 }
                {kpi.change} {kpi.title.includes("Points") ? "this month" : "vs last month"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Carbon Footprint & CO2 Emissions</CardTitle>
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
                <ChartLegend content={<ChartLegendContent iconType="circle" />} />
                <Bar dataKey="footprint" fill="var(--color-footprint)" radius={4} name={carbonChartConfig.footprint.label as string} />
                <Bar dataKey="co2" fill="var(--color-co2)" radius={4} name={carbonChartConfig.co2.label as string} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Utility Usage Overview</CardTitle>
            <CardDescription>Monthly water waste and electricity usage.</CardDescription>
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
                <RechartsTooltip content={<ChartTooltipContent indicator="line" />} />
                <ChartLegend content={<ChartLegendContent iconType="line" />} />
                <Line type="monotone" dataKey="water" stroke="var(--color-water)" strokeWidth={3} dot={{r:4, strokeWidth:2}} activeDot={{r:6}} name={utilityChartConfig.water.label as string} />
                <Line type="monotone" dataKey="electricity" stroke="var(--color-electricity)" strokeWidth={3} dot={{r:4, strokeWidth:2}} activeDot={{r:6}} name={utilityChartConfig.electricity.label as string} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Air Quality Index (AQI)</CardTitle>
            <CardDescription>Nearby. Lower is better (0-50 Good).</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ChartContainer config={sustainabilityGaugeChartConfig} className="h-[250px] w-[250px]">
              <RadialBarChart
                data={aqiGaugeData}
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
            <CardDescription>Nearby. Higher is better (0-100).</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
             <ChartContainer config={sustainabilityGaugeChartConfig} className="h-[250px] w-[250px]">
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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Renewable Energy Mix</CardTitle>
            <CardDescription>Percentage of energy from renewables.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
             <ChartContainer config={sustainabilityGaugeChartConfig} className="h-[250px] w-[250px]">
              <RadialBarChart
                data={renewableEnergyGaugeData}
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
                  name="renewable"
                  angleAxisId={0}
                  fill="var(--color-renewable)"
                  cornerRadius={10}
                />
                <RechartsTooltip content={<ChartTooltipContent hideLabel indicator="line" nameKey="name" />} />
                 <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-4xl font-bold">
                  {renewableEnergyGaugeData[0].value}%
                </text>
                <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                  Renewable
                </text>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Waste Recycling Rate</CardTitle>
            <CardDescription>Percentage of waste being recycled.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
             <ChartContainer config={sustainabilityGaugeChartConfig} className="h-[250px] w-[250px]">
              <RadialBarChart
                data={recyclingRateGaugeData}
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
                  name="recycling"
                  angleAxisId={0}
                  fill="var(--color-recycling)"
                  cornerRadius={10}
                />
                <RechartsTooltip content={<ChartTooltipContent hideLabel indicator="line" nameKey="name" />} />
                 <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-4xl font-bold">
                  {recyclingRateGaugeData[0].value}%
                </text>
                <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-sm">
                  Recycled
                </text>
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="shadow-lg lg:col-span-1">
            <CardHeader>
                <CardTitle>Carbon Footprint Breakdown</CardTitle>
                <CardDescription>Distribution of carbon footprint by source.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <ChartContainer config={carbonSourceChartConfig} className="h-[350px] w-full max-w-lg">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                            <Pie
                                data={carbonSourceData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + (radius + 20) * Math.cos(-midAngle * RADIAN);
                                  const y = cy + (radius + 20) * Math.sin(-midAngle * RADIAN);
                                  const Icon = carbonSourceData[index].icon;
                                  return (
                                    <>
                                    <text x={x} y={y - 5} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
                                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                                    </text>
                                     {Icon && <foreignObject x={x- (x > cx ? 0 : 20) -8 } y={y + 5} width="16" height="16" >
                                        <Icon className="w-4 h-4 text-muted-foreground" style={{color: carbonSourceData[index].fill}} />
                                      </foreignObject>
                                    }
                                    </>
                                  );
                                }}
                            >
                                {carbonSourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                             <ChartLegend content={<ChartLegendContent nameKey="name" iconType="circle" />} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}

