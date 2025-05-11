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
import { Loader2, BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';

const predictionFormSchema = z.object({
  energyConsumption: z.coerce.number().min(0, "Energy consumption must be positive"),
  travelDistance: z.coerce.number().min(0, "Travel distance must be positive"),
  wasteGeneration: z.coerce.number().min(0, "Waste generation must be positive"),
  companySize: z.coerce.number().int().min(1, "Company size must be at least 1"),
  location: z.string().min(2, "Location is required"),
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
        description: "Carbon footprint prediction generated.",
        variant: "default",
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

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Carbon Footprint Prediction</CardTitle>
          <CardDescription>Enter your company's operational data to predict future carbon footprint and explore impact scenarios.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="energyConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Energy Consumption (kWh)</FormLabel>
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
                    <FormLabel>Monthly Travel Distance (km)</FormLabel>
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
                    <FormLabel>Monthly Waste Generation (kg)</FormLabel>
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
                    Predicting...
                  </>
                ) : (
                  "Predict Footprint"
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
              <BarChart3 className="text-primary" /> Prediction Results
            </CardTitle>
            <CardDescription>Based on the data provided, here's your predicted carbon footprint and potential impact scenarios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-muted-foreground">Predicted Carbon Footprint</Label>
              <p className="text-3xl font-bold text-primary">
                {predictionResult.predictedFootprint.toLocaleString()} tons CO2 equivalent
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Impact Scenarios:</h4>
              <div className="p-4 bg-secondary/30 rounded-md border border-border">
                <p className="font-medium text-secondary-foreground">Scenario 1: Reduce Energy Consumption by 20%</p>
                <p className="text-sm text-muted-foreground">{predictionResult.impactScenario1}</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-md border border-border">
                <p className="font-medium text-secondary-foreground">Scenario 2: Reduce Travel Distance by 30%</p>
                <p className="text-sm text-muted-foreground">{predictionResult.impactScenario2}</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-md border border-border">
                <p className="font-medium text-secondary-foreground">Scenario 3: Reduce Waste Generation by 40%</p>
                <p className="text-sm text-muted-foreground">{predictionResult.impactScenario3}</p>
              </div>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">Note: These predictions are estimates and may vary based on other factors.</p>
          </CardFooter>
        </Card>
      )}
       {isLoading && !predictionResult && (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 rounded-lg border bg-card text-card-foreground shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Generating your prediction...</p>
          <p className="text-sm text-muted-foreground text-center">This might take a few moments. Please wait.</p>
        </div>
      )}
    </div>
  );
}
