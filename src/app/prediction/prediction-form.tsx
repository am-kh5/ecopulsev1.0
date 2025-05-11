
"use client";

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { carbonFootprintPrediction, type CarbonFootprintPredictionInput, type CarbonFootprintPredictionOutput } from '@/ai/flows/carbon-footprint-prediction';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart3, AlertTriangle, CheckCircle2, Lightbulb, ThumbsUp, Zap, Recycle, Car, Info, Sun, Users, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";


const predictionFormSchema = z.object({
  energyConsumption: z.coerce.number().min(0, "Energy consumption must be positive."),
  travelDistance: z.coerce.number().min(0, "Travel distance must be positive."),
  wasteGeneration: z.coerce.number().min(0, "Waste generation must be positive."),
  companySize: z.coerce.number().int().min(1, "Company size must be at least 1."),
  currentRecyclingRate: z.coerce.number().min(0).max(100).optional(),
  currentRenewableEnergyMix: z.coerce.number().min(0).max(100).optional(),
});

type PredictionFormValues = z.infer<typeof predictionFormSchema>;

const dashboardData = { // Mock data, replace with actual data fetching if needed
  energyConsumption: 300000, 
  travelDistance: 50000, 
  wasteGeneration: 15000, 
  companySize: 100,
  currentRecyclingRate: 70,
  currentRenewableEnergyMix: 65,
};

const futureProjectionChartConfig = {
  projectedFootprint: {
    label: "Projected Footprint (tons CO2e)",
    color: "hsl(var(--chart-1))",
    icon: TrendingUpIcon,
  },
} satisfies ChartConfig;


export default function PredictionForm() {
  const [predictionResult, setPredictionResult] = useState<CarbonFootprintPredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      energyConsumption: dashboardData.energyConsumption,
      travelDistance: dashboardData.travelDistance,
      wasteGeneration: dashboardData.wasteGeneration,
      companySize: dashboardData.companySize,
      currentRecyclingRate: dashboardData.currentRecyclingRate,
      currentRenewableEnergyMix: dashboardData.currentRenewableEnergyMix,
    },
  });

  async function onSubmit(formData: PredictionFormValues) {
    setIsLoading(true);
    setPredictionResult(null);

    const predictionInput: CarbonFootprintPredictionInput = {
      energyConsumption: formData.energyConsumption,
      travelDistance: formData.travelDistance,
      wasteGeneration: formData.wasteGeneration,
      companySize: formData.companySize,
      currentRecyclingRate: formData.currentRecyclingRate,
      currentRenewableEnergyMix: formData.currentRenewableEnergyMix,
    };

    try {
      const result = await carbonFootprintPrediction(predictionInput);
      setPredictionResult(result);
      toast({
        title: "Prediction Successful",
        description: "Carbon footprint prediction and advice generated.",
        action: <CheckCircle2 className="text-green-500" />,
      });
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        title: "Prediction Failed",
        description: "Could not generate carbon footprint prediction. Please try again.",
        variant: "destructive",
        action: <AlertTriangle className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getAssessmentColor = (assessment: string | undefined) => {
    switch (assessment?.toLowerCase()) {
      case 'very high':
      case 'high':
        return 'text-destructive';
      case 'moderate':
        return 'text-orange-500'; 
      case 'low':
      case 'very low':
        return 'text-green-600';
      default:
        return 'text-foreground';
    }
  };


  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            AI Carbon Footprint Prediction
          </CardTitle>
          <CardDescription>
            Enter your company&apos;s operational data below (pre-filled with example dashboard data). Our AI will predict your carbon footprint, assess it, and provide actionable advice along with a 6-month projection.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="energyConsumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-primary/80" />Monthly Energy (kWh)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 300000" {...field} />
                      </FormControl>
                      <FormDescription>Total electricity consumption in kilowatt-hours.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="travelDistance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Car className="w-4 h-4 text-primary/80" />Monthly Travel (km)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50000" {...field} />
                      </FormControl>
                      <FormDescription>Total business travel distance in kilometers.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wasteGeneration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Recycle className="w-4 h-4 text-primary/80" />Monthly Waste (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 15000" {...field} />
                      </FormControl>
                       <FormDescription>Total non-hazardous solid waste generated.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary/80" />Company Size (Employees)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                      </FormControl>
                      <FormDescription>Number of full-time employees.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentRecyclingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Recycle className="w-4 h-4 text-green-600" />Current Recycling Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 70" {...field} />
                      </FormControl>
                      <FormDescription>Optional: Your company&apos;s current waste recycling rate.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentRenewableEnergyMix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-orange-500" />Renewable Energy Mix (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 65" {...field} />
                      </FormControl>
                      <FormDescription>Optional: Percentage of energy from renewable sources.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Prediction...
                  </>
                ) : (
                  "Get AI Prediction & Advice"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && !predictionResult && (
        <Card className="shadow-lg h-full flex flex-col items-center justify-center md:col-span-1"> {/* Ensure it takes one column if form takes one */}
            <CardContent className="text-center p-6">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">AI is working its magic...</h3>
              <p className="text-muted-foreground">
                This might take a few moments. We&apos;re generating predictions and personalized advice based on your inputs.
              </p>
            </CardContent>
        </Card>
      )}

      {predictionResult && !isLoading && (
        <Card className="shadow-lg md:col-span-2"> {/* Make result card span 2 cols if form is on 1 */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-primary h-6 w-6" /> AI Analysis Results
            </CardTitle>
            <CardDescription>Based on your inputs, here&apos;s the AI-generated carbon footprint analysis and advice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border">
                <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Predicted Monthly Footprint</Label>
                <p className="text-3xl md:text-4xl font-bold text-primary mt-1">
                    {predictionResult.predictedMonthlyFootprint.toLocaleString()} tons CO2e
                </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border">
                <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Projected Annual Footprint</Label>
                <p className="text-3xl md:text-4xl font-bold text-primary/80 mt-1">
                    {predictionResult.projectedAnnualFootprint.toLocaleString()} tons CO2e
                </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border">
                <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Footprint Assessment</Label>
                <p className={`text-2xl md:text-3xl font-semibold mt-1 ${getAssessmentColor(predictionResult.footprintAssessment)}`}>
                    {predictionResult.footprintAssessment}
                </p>
                </div>
            </div>
            
            {predictionResult.improvementAdvice && predictionResult.improvementAdvice.length > 0 && (
              <Alert variant="default" className="border-orange-500/50 bg-orange-500/5 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-500/30">
                <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <AlertTitle className="font-semibold">Actionable Improvement Advice</AlertTitle>
                <AlertDescription className="mt-2">
                  <ul className="list-disc space-y-1.5 pl-5">
                    {predictionResult.improvementAdvice.map((advice, index) => (
                      <li key={index}>{advice}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {predictionResult.positiveRemarks && predictionResult.positiveRemarks.length > 0 && (
               <Alert variant="default" className="border-green-500/50 bg-green-500/5 text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500/30">
                <ThumbsUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle className="font-semibold">Positive Remarks</AlertTitle>
                <AlertDescription className="mt-2">
                   <ul className="list-disc space-y-1.5 pl-5">
                    {predictionResult.positiveRemarks.map((remark, index) => (
                      <li key={index}>{remark}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {predictionResult.sixMonthFootprintProjection && predictionResult.sixMonthFootprintProjection.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUpIcon className="h-6 w-6 text-primary" />
                    6-Month Carbon Footprint Projection
                  </CardTitle>
                  <CardDescription>Estimated carbon footprint (tons CO2e) for the next six months.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={futureProjectionChartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={predictionResult.sixMonthFootprintProjection} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="monthName" 
                          tickLine={false} 
                          axisLine={false} 
                          tickMargin={10} 
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis 
                          label={{ value: 'tons CO2e', angle: -90, position: 'insideLeft', offset:0, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                          tickFormatter={(value) => value.toLocaleString()}
                        />
                        <RechartsTooltip
                          content={<ChartTooltipContent indicator="line" labelKey="monthName" />}
                        />
                         <ChartLegend content={<ChartLegendContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="projectedFootprint" 
                          stroke="var(--color-projectedFootprint)" 
                          strokeWidth={3} 
                          dot={{ r: 5, fill: "var(--color-projectedFootprint)", strokeWidth:2, stroke: "hsl(var(--background))" }}
                          activeDot={{ r: 7, strokeWidth:2, fill: "hsl(var(--background))", stroke: "var(--color-projectedFootprint)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </CardContent>
           <CardFooter>
            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-md bg-muted/20 border border-dashed">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                This AI-generated analysis provides estimates based on the data you provided and general environmental models. For precise figures and comprehensive, tailored strategies, consider a detailed professional audit.
              </p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

