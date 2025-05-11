
"use client";

import type React from 'react';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, Download, Filter, FileText, Lightbulb, BarChartBig, Loader2, Info, PieChart as PieChartIcon, Zap, Car, RecycleIcon, Building } from "lucide-react"; // Added PieChartIcon
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";
import { generateComprehensiveReport, type GenerateComprehensiveReportInput, type GenerateComprehensiveReportOutput } from '@/ai/flows/generate-comprehensive-report';
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface ReportEntry {
  id: string;
  date: string;
  category: string;
  metric: string;
  value: string;
  change?: string;
}

const allReportData: ReportEntry[] = [
  { id: "1", date: format(subDays(new Date(), 2), "yyyy-MM-dd"), category: "Carbon Footprint", metric: "Total Emissions", value: "120 tons CO2e", change: "-5%" },
  { id: "2", date: format(subDays(new Date(), 2), "yyyy-MM-dd"), category: "Water Usage", metric: "Total Consumption", value: "1450 m³", change: "-8%" },
  { id: "3", date: format(subDays(new Date(), 2), "yyyy-MM-dd"), category: "Electricity", metric: "Total Consumption", value: "28000 kWh", change: "-3%" },
  { id: "4", date: format(subDays(new Date(), 10), "yyyy-MM-dd"), category: "Carbon Footprint", metric: "Scope 1 Emissions", value: "70 tons CO2e", change: "-2%" },
  { id: "5", date: format(subDays(new Date(), 10), "yyyy-MM-dd"), category: "Waste Management", metric: "Recycled Waste", value: "85%", change: "+2%" },
  { id: "6", date: format(subDays(new Date(), 15), "yyyy-MM-dd"), category: "Water Usage", metric: "Wastewater Treated", value: "90%", change: "+1%" },
  { id: "7", date: format(subDays(new Date(), 20), "yyyy-MM-dd"), category: "Electricity", metric: "Renewable Energy Mix", value: "25%", change: "+5%" },
  { id: "8", date: format(subDays(new Date(), 30), "yyyy-MM-dd"), category: "Carbon Footprint", metric: "Total Emissions", value: "150 tons CO2e", change: "-3%" },
];

const reportCategories = ["All Categories", "Carbon Footprint", "Water Usage", "Electricity", "Waste Management"];

// Define colors for the pie chart, similar to dashboard
const PIE_CHART_COLORS = [
  "hsl(var(--chart-1))", // Teal
  "hsl(var(--chart-2))", // Orange
  "hsl(var(--chart-4))", // Blue
  "hsl(var(--chart-5))", // Green (original was yellow/orange, adjusted for variety)
  "hsl(var(--primary))", // Primary Teal
];

const getIconForSource = (sourceName: string): React.ElementType => {
  if (sourceName.toLowerCase().includes("energy")) return Zap;
  if (sourceName.toLowerCase().includes("travel")) return Car;
  if (sourceName.toLowerCase().includes("waste")) return RecycleIcon;
  if (sourceName.toLowerCase().includes("operation")) return Building;
  return PieChartIcon; // Default icon
};

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const to = endOfMonth(new Date());
    const from = startOfMonth(subMonths(new Date(), 5)); // Last 6 months including current
    return { from, to };
  });
  const [category, setCategory] = useState<string>("All Categories");
  const [filteredData, setFilteredData] = useState<ReportEntry[]>(allReportData);
  const [generatedReport, setGeneratedReport] = useState<GenerateComprehensiveReportOutput | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let data = allReportData;
    if (dateRange?.from && dateRange?.to) {
      data = data.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= dateRange.from! && entryDate <= dateRange.to!;
      });
    }
    if (category !== "All Categories") {
      data = data.filter(entry => entry.category === category);
    }
    setFilteredData(data);
  }, [dateRange, category]);

  const handleGenerateReport = async () => {
    setIsLoadingReport(true);
    setGeneratedReport(null);

    const companyDataInput: GenerateComprehensiveReportInput = {
      // Using placeholder data similar to prediction form defaults
      companyName: "EcoCorp Inc.",
      energyConsumption: 29000,
      travelDistance: 8750,
      wasteGeneration: 125000,
      companySize: 50,
      currentRecyclingRate: 70,
      currentRenewableEnergyMix: 65,
      reportingPeriod: `Last 6 Months (${format(dateRange?.from || new Date(), "MMMM yyyy")} - ${format(dateRange?.to || new Date(), "MMMM yyyy")})`,
    };

    try {
      const report = await generateComprehensiveReport(companyDataInput);
      setGeneratedReport(report);
      toast({
        title: "Report Generated Successfully",
        description: "AI-powered environmental impact report is ready.",
      });
    } catch (error) {
      console.error("Report generation failed:", error);
      toast({
        title: "Report Generation Failed",
        description: "Could not generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReport(false);
    }
  };
  
  const emissionSourceChartConfig = React.useMemo(() => {
    if (!generatedReport?.carbonEmissionBreakdown.sourceData) return {} as ChartConfig;
    
    const config: ChartConfig = {};
    generatedReport.carbonEmissionBreakdown.sourceData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
        icon: getIconForSource(item.name),
      };
    });
    return config;
  }, [generatedReport]);


  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="h-7 w-7 text-primary" />
                Environmental Impact Reports
              </CardTitle>
              <CardDescription>
                Generate an AI-powered comprehensive report or filter historical data entries.
              </CardDescription>
            </div>
            <Button onClick={handleGenerateReport} disabled={isLoadingReport} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoadingReport ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate AI Report
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoadingReport && (
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-10 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is analyzing data and compiling your report. This may take a moment...</p>
          </CardContent>
        </Card>
      )}

      {generatedReport && !isLoadingReport && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-primary">{generatedReport.reportTitle}</CardTitle>
            <CardDescription>
              Generated on: {format(new Date(generatedReport.generatedDate), "MMMM dd, yyyy")} | Period Covered: {generatedReport.periodCovered}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Executive Summary</h3>
              <p className="text-muted-foreground whitespace-pre-line">{generatedReport.executiveSummary}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Key Metrics Trend Analysis</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-muted/20 p-4">
                  <CardTitle className="text-md mb-1">Carbon Footprint</CardTitle>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{generatedReport.keyMetricsTrendAnalysis.carbonFootprint}</p>
                </Card>
                <Card className="bg-muted/20 p-4">
                  <CardTitle className="text-md mb-1">Energy Consumption</CardTitle>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{generatedReport.keyMetricsTrendAnalysis.energyConsumption}</p>
                </Card>
                <Card className="bg-muted/20 p-4">
                  <CardTitle className="text-md mb-1">Water Usage</CardTitle>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{generatedReport.keyMetricsTrendAnalysis.waterUsage}</p>
                </Card>
                <Card className="bg-muted/20 p-4">
                  <CardTitle className="text-md mb-1">Waste Generation</CardTitle>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{generatedReport.keyMetricsTrendAnalysis.wasteGeneration}</p>
                </Card>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Carbon Emission Breakdown</h3>
              <p className="text-muted-foreground mb-4 whitespace-pre-line">{generatedReport.carbonEmissionBreakdown.analysisText}</p>
              {generatedReport.carbonEmissionBreakdown.sourceData && generatedReport.carbonEmissionBreakdown.sourceData.length > 0 && (
                <ChartContainer config={emissionSourceChartConfig} className="h-[350px] w-full max-w-lg mx-auto">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <RechartsTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <Pie
                        data={generatedReport.carbonEmissionBreakdown.sourceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        labelLine={false}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + (radius + 25) * Math.cos(-midAngle * RADIAN);
                          const y = cy + (radius + 25) * Math.sin(-midAngle * RADIAN);
                          const item = generatedReport.carbonEmissionBreakdown.sourceData[index];
                          const Icon = getIconForSource(item.name);
                          return (
                            <>
                              <text x={x} y={y - 5} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                                {`${item.name} (${(item.percentage).toFixed(0)}%)`}
                              </text>
                              {Icon && 
                                <foreignObject x={x - (x > cx ? 0 : 16) - (x > cx ? -4 : 4) } y={y + 5} width="16" height="16" >
                                   <Icon className="w-4 h-4" style={{color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}} />
                                </foreignObject>
                              }
                            </>
                          );
                        }}
                      >
                        {generatedReport.carbonEmissionBreakdown.sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartLegendContent nameKey="name" />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">AI Insights & Recommendations</h3>
              <Alert variant="default" className="mb-4">
                <Lightbulb className="h-5 w-5" />
                <AlertTitle>AI Assessment: {generatedReport.aiInsightsAndRecommendations.currentAssessment}</AlertTitle>
                <AlertDescription>
                  {generatedReport.aiInsightsAndRecommendations.improvementAdvice && generatedReport.aiInsightsAndRecommendations.improvementAdvice.length > 0 && (
                    <>
                      <strong className="block mt-2 mb-1">Improvement Advice:</strong>
                      <ul className="list-disc space-y-1 pl-5">
                        {generatedReport.aiInsightsAndRecommendations.improvementAdvice.map((advice, index) => (
                          <li key={index}>{advice}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {generatedReport.aiInsightsAndRecommendations.positiveRemarks && generatedReport.aiInsightsAndRecommendations.positiveRemarks.length > 0 && (
                    <>
                      <strong className="block mt-2 mb-1">Positive Remarks:</strong>
                      <ul className="list-disc space-y-1 pl-5">
                        {generatedReport.aiInsightsAndRecommendations.positiveRemarks.map((remark, index) => (
                          <li key={index}>{remark}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Future Outlook Projection</h3>
              <p className="text-muted-foreground whitespace-pre-line">{generatedReport.futureOutlookProjection}</p>
            </section>
          </CardContent>
          <CardFooter>
            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-md bg-muted/20 border border-dashed w-full">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                This AI-generated report provides insights and estimates based on the data provided and general environmental models. For precise figures and comprehensive, tailored strategies, consider a detailed professional audit.
              </p>
            </div>
          </CardFooter>
        </Card>
      )}

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-6 w-6 text-primary" />
            Historical Data Entries
          </CardTitle>
          <CardDescription>
            View and filter key environmental metrics from past records.
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
             <Button variant="outline" className="w-full md:w-auto ml-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Table (CSV)
            </Button>
          </div>

          {filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Change (vs prev.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell className="font-medium text-foreground">{entry.metric}</TableCell>
                    <TableCell>{entry.value}</TableCell>
                    <TableCell className={`text-right ${entry.change?.startsWith('-') ? 'text-[hsl(var(--success))]' : entry.change?.startsWith('+') ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {entry.change || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No data matches your current filters.</p>
              <p className="text-sm">Try adjusting the date range or category.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
