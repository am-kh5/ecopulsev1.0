
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart3, AlertTriangle, CheckCircle2, Lightbulb, ThumbsUp, Zap, Recycle, Car, Info, Wind, Sun } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// These would ideally be fetched or passed as props from a service/context that has dashboard data.
// For now, using static values that correspond to the dashboard's sample data.
const LATEST_DASHBOARD_ENERGY_CONSUMPTION = 29000; // kWh (from dashboard/page.tsx monthlyUtilityData for June)
const LATEST_RECYCLING_RATE = 70; // % (from dashboard/page.tsx kpiData)
const LATEST_RENEWABLE_ENERGY_MIX = 65; // % (from dashboard/page.tsx kpiData)


const predictionFormSchema = z.object({
  // energyConsumption, currentRecyclingRate, currentRenewableEnergyMix are now derived from dashboard data
  travelDistance: z.coerce.number().min(0, "Travel distance must be positive"),
  wasteGeneration: z.coerce.number().min(0, "Waste generation must be positive"), // This remains user input as dashboard "Water Waste" is in m³, model expects kg for general waste.
  companySize: z.coerce.number().int().min(1, "Company size must be at least 1"),
  location: z.string().min(2, "Location is required (e.g., City, Country)"),
});

type PredictionFormValues = z.infer<typeof predictionFormSchema>;

export default function PredictionForm() {
  const [predictionResult, setPredictionResult] = useState<CarbonFootprintPredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      travelDistance: 5000, 
      wasteGeneration: 2000, 
      companySize: 50,
      location: "New York, USA",
    },
  });

  async function onSubmit(formData: PredictionFormValues) {
    setIsLoading(true);
    setPredictionResult(null);

    const predictionInput: CarbonFootprintPredictionInput = {
      energyConsumption: LATEST_DASHBOARD_ENERGY_CONSUMPTION,
      currentRecyclingRate: LATEST_RECYCLING_RATE,
      currentRenewableEnergyMix: LATEST_RENEWABLE_ENERGY_MIX,
      travelDistance: formData.travelDistance,
      wasteGeneration: formData.wasteGeneration,
      companySize: formData.companySize,
      location: formData.location,
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
            AI Carbon Footprint Analysis
          </CardTitle>
          <CardDescription>
            Key metrics from your dashboard (energy use, recycling rate, renewables) are automatically included. 
            Please provide the remaining details to predict your company's carbon footprint and receive actionable advice.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="p-3 border rounded-md bg-muted/30">
                  <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Zap className="w-4 h-4" />
                    Monthly Energy Consumption
                  </Label>
                  <div className="mt-1 text-foreground font-semibold text-lg">
                    {LATEST_DASHBOARD_ENERGY_CONSUMPTION.toLocaleString()} kWh
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Sourced from dashboard</p>
                </div>
                <div className="p-3 border rounded-md bg-muted/30">
                  <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Recycle className="w-4 h-4" />
                    Current Recycling Rate
                  </Label>
                  <div className="mt-1 text-foreground font-semibold text-lg">
                    {LATEST_RECYCLING_RATE}%
                  </div>
                   <p className="text-xs text-muted-foreground mt-0.5">Sourced from dashboard</p>
                </div>
                 <div className="p-3 border rounded-md bg-muted/30">
                  <Label className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Sun className="w-4 h-4" />
                    Current Renewable Energy Mix
                  </Label>
                  <div className="mt-1 text-foreground font-semibold text-lg">
                    {LATEST_RENEWABLE_ENERGY_MIX}%
                  </div>
                   <p className="text-xs text-muted-foreground mt-0.5">Sourced from dashboard</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="travelDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Car className="w-4 h-4 text-muted-foreground" />Monthly Travel Distance (km)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wasteGeneration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Recycle className="w-4 h-4 text-muted-foreground" />Monthly Waste Generation (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2000" {...field} />
                    </FormControl>
                     <FormDescription>Total non-hazardous solid waste generated by the company.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New York, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  "Get AI Analysis & Prediction"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && !predictionResult && (
        <Card className="shadow-lg h-full flex flex-col items-center justify-center">
            <CardContent className="text-center p-6">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">AI is analyzing your data...</h3>
              <p className="text-muted-foreground">
                This might take a few moments. We're generating predictions and personalized advice based on your company's profile and latest dashboard metrics.
              </p>
            </CardContent>
        </Card>
      )}

      {predictionResult && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-primary h-6 w-6" /> AI Analysis Results
            </CardTitle>
            <CardDescription>Based on your data, here's the AI-generated carbon footprint analysis and advice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/30 border">
              <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Predicted Monthly Carbon Footprint</Label>
              <p className="text-4xl font-bold text-primary mt-1">
                {predictionResult.predictedMonthlyFootprint.toLocaleString()} tons CO2e
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border">
              <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Projected Annual Carbon Footprint</Label>
              <p className="text-3xl font-bold text-primary/80 mt-1">
                {predictionResult.projectedAnnualFootprint.toLocaleString()} tons CO2e
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border">
              <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Footprint Assessment</Label>
              <p className={`text-2xl font-semibold mt-1 ${getAssessmentColor(predictionResult.footprintAssessment)}`}>
                {predictionResult.footprintAssessment}
              </p>
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
          </CardContent>
           <CardFooter>
            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-md bg-muted/20 border border-dashed">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                This AI-generated analysis provides estimates based on the data you've shared and general environmental models. For precise figures and comprehensive, tailored strategies, consider a detailed professional audit.
              </p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
