
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
import { Loader2, BarChart3, AlertTriangle, CheckCircle2, Lightbulb, ThumbsUp, TrendingUp, Zap, Recycle, Car } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const predictionFormSchema = z.object({
  energyConsumption: z.coerce.number().min(0, "Energy consumption must be positive"),
  travelDistance: z.coerce.number().min(0, "Travel distance must be positive"),
  wasteGeneration: z.coerce.number().min(0, "Waste generation must be positive"),
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
      energyConsumption: 10000,
      travelDistance: 5000,
      wasteGeneration: 2000,
      companySize: 50,
      location: "New York, USA",
    },
  });

  async function onSubmit(data: PredictionFormValues) {
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const result = await carbonFootprintPrediction(data as CarbonFootprintPredictionInput);
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
        return 'text-orange-500'; // Using a direct Tailwind color for simplicity here.
      case 'low':
      case 'very low':
        return 'text-green-600'; // Using a direct Tailwind color for simplicity here.
      default:
        return 'text-foreground';
    }
  };


  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            AI Carbon Footprint Analysis
          </CardTitle>
          <CardDescription>Enter your company's current monthly operational data to predict its carbon footprint, receive an assessment, and get actionable advice.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="energyConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Zap className="w-4 h-4 text-muted-foreground" />Monthly Energy Consumption (kWh)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

      {predictionResult && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-primary" /> AI Analysis Results
            </CardTitle>
            <CardDescription>Based on your data, here's the AI-generated carbon footprint analysis and advice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-muted-foreground">Predicted Monthly Carbon Footprint</Label>
              <p className="text-3xl font-bold text-primary">
                {predictionResult.predictedMonthlyFootprint.toLocaleString()} tons CO2e
              </p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-muted-foreground">Projected Annual Carbon Footprint</Label>
              <p className="text-2xl font-bold text-primary/80">
                {predictionResult.projectedAnnualFootprint.toLocaleString()} tons CO2e
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold text-muted-foreground">Footprint Assessment</Label>
              <p className={`text-xl font-semibold ${getAssessmentColor(predictionResult.footprintAssessment)}`}>
                {predictionResult.footprintAssessment}
              </p>
            </div>
            
            {predictionResult.improvementAdvice && predictionResult.improvementAdvice.length > 0 && (
              <Alert variant="default" className="border-orange-500/50 bg-orange-500/10">
                <Lightbulb className="h-5 w-5 text-orange-600" />
                <AlertTitle className="text-orange-700">Actionable Improvement Advice</AlertTitle>
                <AlertDescription className="text-orange-700/90">
                  <ul className="list-disc space-y-1 pl-5 mt-2">
                    {predictionResult.improvementAdvice.map((advice, index) => (
                      <li key={index}>{advice}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {predictionResult.positiveRemarks && predictionResult.positiveRemarks.length > 0 && (
               <Alert variant="default" className="border-green-500/50 bg-green-500/10">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-700">Positive Remarks</AlertTitle>
                <AlertDescription className="text-green-700/90">
                   <ul className="list-disc space-y-1 pl-5 mt-2">
                    {predictionResult.positiveRemarks.map((remark, index) => (
                      <li key={index}>{remark}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              Note: This AI-generated analysis is based on the provided data and general estimations. For precise figures and tailored strategies, consider a detailed professional audit.
            </p>
          </CardFooter>
        </Card>
      )}
       {isLoading && !predictionResult && (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 rounded-lg border bg-card text-card-foreground shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">AI is analyzing your data...</p>
          <p className="text-sm text-muted-foreground text-center">This might take a few moments. Generating predictions and advice.</p>
        </div>
      )}
    </div>
  );
}
