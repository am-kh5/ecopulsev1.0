
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download, Filter, FileText, Building, Plane, PackageIcon, Lightbulb, TrendingUp, AlertTriangle, Info } from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";


const reportCategories = ["All Categories", "Carbon Footprint", "Water Usage", "Electricity", "Waste Management"];

const staticReportContent = {
  companyName: "EcoCorp Inc.",
  reportingPeriod: "Last 6 Months (January 2024 - June 2024)",
  generatedDate: format(new Date(), "MMMM dd, yyyy"),
  overallSummary: "EcoCorp Inc. has demonstrated commendable progress in its sustainability initiatives over the past six months. The total carbon footprint saw a reduction of approximately 5.2%, moving from 150 tons CO2e in January to 120 tons CO2e in June. This positive trend is attributed to concerted efforts in energy efficiency, waste management, and a slight increase in renewable energy adoption. While challenges remain, particularly in Scope 2 emissions related to purchased electricity, the overall trajectory is encouraging.",
  keyEmissionDrivers: {
    title: "Key Emission Drivers & Breakdown",
    description: "The primary contributors to EcoCorp Inc.'s carbon emissions during this period were identified as follows. Understanding these sources is crucial for targeted reduction strategies.",
    sources: [
      { name: "Operations (Energy)", value: 500, percentage: 40, details: "Primarily from electricity consumption for building operations (HVAC, lighting) and manufacturing processes. Represents the largest share of emissions.", icon: Building, fill: "hsl(var(--chart-1))" },
      { name: "Travel & Logistics", value: 437.5, percentage: 35, details: "Includes business travel (air and ground), employee commuting, and freight transportation for raw materials and finished goods.", icon: Plane, fill: "hsl(var(--chart-2))" },
      { name: "Materials & Supply Chain", value: 312.5, percentage: 25, details: "Embodied carbon in purchased raw materials, components, and services, along with upstream emissions from suppliers.", icon: PackageIcon, fill: "hsl(var(--chart-4))" },
    ]
  },
  trendAnalysis: {
    title: "Trend Analysis (Last 6 Months)",
    points: [
      "Carbon Footprint: Decreased by 5.2% (150 to 120 tons CO2e). This indicates successful implementation of initial reduction measures.",
      "CO2 Emissions (Direct): Showed a slight increase of 2.1% initially, then stabilized. This needs monitoring, potentially linked to increased production.",
      "Water Waste: Significant reduction of 10% (1800 m³ to 1450 m³ per month on average). Water conservation efforts are proving effective.",
      "Electricity Usage: Reduced by 3% on average. Further gains possible with equipment upgrades and behavior change programs.",
      "Renewable Energy Mix: Increased by 5% (from 60% to 65%). Continued focus on sourcing renewables is key.",
      "Recycling Rate: Improved by 3% (from 67% to 70%). Shows good employee engagement and waste stream management."
    ]
  },
  recommendations: {
    title: "Strategic Recommendations",
    points: [
      "Further optimize energy consumption by investing in smart building technology and conducting energy audits for high-consumption machinery.",
      "Develop a sustainable procurement policy to prioritize suppliers with lower carbon footprints and increase the use of recycled/renewable materials.",
      "Enhance employee engagement programs focused on sustainable commuting options and waste reduction at source.",
      "Investigate the slight increase in direct CO2 emissions to identify root causes and implement corrective actions.",
      "Set more ambitious targets for increasing the renewable energy mix, potentially exploring on-site generation."
    ]
  },
  conclusion: "EcoCorp Inc. is on a positive path towards sustainability. By addressing the key emission drivers identified and implementing the strategic recommendations, the company can further reduce its environmental impact and strengthen its position as an eco-conscious leader."
};

const emissionSourceChartConfig = {
  operations: { label: staticReportContent.keyEmissionDrivers.sources[0].name, color: staticReportContent.keyEmissionDrivers.sources[0].fill, icon: staticReportContent.keyEmissionDrivers.sources[0].icon },
  travel: { label: staticReportContent.keyEmissionDrivers.sources[1].name, color: staticReportContent.keyEmissionDrivers.sources[1].fill, icon: staticReportContent.keyEmissionDrivers.sources[1].icon },
  materials: { label: staticReportContent.keyEmissionDrivers.sources[2].name, color: staticReportContent.keyEmissionDrivers.sources[2].fill, icon: staticReportContent.keyEmissionDrivers.sources[2].icon },
} satisfies ChartConfig;


export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const to = endOfMonth(new Date());
    const from = startOfMonth(subMonths(new Date(), 5));
    return { from, to };
  });
  const [category, setCategory] = useState<string>("All Categories");
  
  // Client-side date formatting for the report to avoid hydration issues
  const [formattedGeneratedDate, setFormattedGeneratedDate] = useState("");
  const [formattedReportingPeriod, setFormattedReportingPeriod] = useState("");

  useEffect(() => {
    // Format dates on client-side to ensure consistency
    if (dateRange?.from && dateRange?.to) {
      setFormattedReportingPeriod(`${format(dateRange.from, "MMMM yyyy")} - ${format(dateRange.to, "MMMM yyyy")}`);
    } else {
      setFormattedReportingPeriod(staticReportContent.reportingPeriod);
    }
    setFormattedGeneratedDate(format(new Date(), "MMMM dd, yyyy"));
  }, [dateRange]);


  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-7 w-7 text-primary" />
            Environmental Impact Report
          </CardTitle>
          <CardDescription>
            A comprehensive overview of {staticReportContent.companyName}'s environmental performance.
            Use the filters below to customize the reporting period and focus area (filters are for UI demonstration).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border rounded-lg bg-muted/30">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {reportCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto ml-auto" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Download / Print Report
            </Button>
          </div>

          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert p-4 border rounded-lg bg-card text-card-foreground">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-primary">{staticReportContent.companyName}</h2>
              <p className="text-lg font-semibold">Environmental Impact Report</p>
              <p className="text-sm text-muted-foreground">
                Period Covered: {formattedReportingPeriod} <br />
                Generated on: {formattedGeneratedDate}
              </p>
            </div>

            <Separator className="my-6" />

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Overall Summary</h3>
              <p>{staticReportContent.overallSummary}</p>
            </section>

            <Separator className="my-6" />
            
            <section className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{staticReportContent.keyEmissionDrivers.title}</h3>
              <p className="mb-4">{staticReportContent.keyEmissionDrivers.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <ul className="space-y-3">
                    {staticReportContent.keyEmissionDrivers.sources.map(source => (
                      <li key={source.name} className="p-3 border rounded-md bg-muted/50">
                        <div className="flex items-center mb-1">
                          <source.icon className="w-5 h-5 mr-2" style={{color: source.fill}} />
                          <strong className="text-foreground">{source.name} ({source.percentage}%)</strong>
                        </div>
                        <p className="text-xs text-muted-foreground">{source.details}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-[350px] w-full">
                   <ChartContainer config={emissionSourceChartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <RechartsTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                        <Pie
                          data={staticReportContent.keyEmissionDrivers.sources}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          labelLine={false}
                           label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                              const RADIAN = Math.PI / 180;
                              const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 15; // Adjust for label position
                              const x = cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              return (
                                <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                                  {`${name} (${(percent * 100).toFixed(0)}%)`}
                                </text>
                              );
                            }}
                        >
                          {staticReportContent.keyEmissionDrivers.sources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="hsl(var(--background))" strokeWidth={2}/>
                          ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" iconType="circle" className="mt-4"/>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </section>
            
            <Separator className="my-6" />

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{staticReportContent.trendAnalysis.title}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {staticReportContent.trendAnalysis.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <Separator className="my-6" />

            <section className="mb-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{staticReportContent.recommendations.title}</h3>
              <ul className="list-disc pl-5 space-y-1">
                {staticReportContent.recommendations.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>
            
            <Separator className="my-6" />

            <section>
              <h3 className="text-xl font-semibold text-primary mb-2">Conclusion</h3>
              <p>{staticReportContent.conclusion}</p>
            </section>
          </div>
        </CardContent>
        <CardFooter>
            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-md bg-muted/20 border border-dashed w-full">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                This report provides a static overview based on pre-defined data for the period ending June 2024. 
                The filters for date range and category are illustrative and do not alter this static content. 
                For dynamic, AI-powered analysis, please refer to the Prediction section.
              </p>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
