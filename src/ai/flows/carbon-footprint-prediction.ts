// Carbon footprint prediction flow
'use server';
/**
 * @fileOverview Predicts future carbon footprint based on company operational data.
 *
 * - carbonFootprintPrediction - A function that predicts the future carbon footprint.
 * - CarbonFootprintPredictionInput - The input type for the carbonFootprintPrediction function.
 * - CarbonFootprintPredictionOutput - The return type for the carbonFootprintPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CarbonFootprintPredictionInputSchema = z.object({
  energyConsumption: z.number().describe('Monthly energy consumption in kWh.'),
  travelDistance: z.number().describe('Monthly travel distance in kilometers.'),
  wasteGeneration: z.number().describe('Monthly waste generation in kilograms.'),
  companySize: z.number().describe('Number of employees in the company.'),
  location: z.string().describe('Location of the company.'),
});
export type CarbonFootprintPredictionInput = z.infer<typeof CarbonFootprintPredictionInputSchema>;

const CarbonFootprintPredictionOutputSchema = z.object({
  predictedFootprint: z.number().describe('Predicted carbon footprint in tons of CO2 equivalent.'),
  impactScenario1: z.string().describe('Scenario 1 describing potential impact of reducing energy consumption by 20%.'),
  impactScenario2: z.string().describe('Scenario 2 describing potential impact of reducing travel distance by 30%.'),
  impactScenario3: z.string().describe('Scenario 3 describing potential impact of reducing waste generation by 40%.'),
});
export type CarbonFootprintPredictionOutput = z.infer<typeof CarbonFootprintPredictionOutputSchema>;

export async function carbonFootprintPrediction(input: CarbonFootprintPredictionInput): Promise<CarbonFootprintPredictionOutput> {
  return carbonFootprintPredictionFlow(input);
}

const carbonFootprintPredictionPrompt = ai.definePrompt({
  name: 'carbonFootprintPredictionPrompt',
  input: {schema: CarbonFootprintPredictionInputSchema},
  output: {schema: CarbonFootprintPredictionOutputSchema},
  prompt: `You are an AI carbon footprint prediction tool for companies. 

  Based on the company's operational data, predict the company's future carbon footprint and show potential impact scenarios to inform better decisions.

  Company operational data:
  - Monthly energy consumption: {{{energyConsumption}}} kWh
  - Monthly travel distance: {{{travelDistance}}} km
  - Monthly waste generation: {{{wasteGeneration}}} kg
  - Number of employees: {{{companySize}}}
  - Location: {{{location}}}

  Respond with a the predicted carbon footprint, and also provide 3 scenarios describing the impact of reducing energy consumption by 20%, reducing travel distance by 30%, and reducing waste generation by 40%.
  `,
});

const carbonFootprintPredictionFlow = ai.defineFlow(
  {
    name: 'carbonFootprintPredictionFlow',
    inputSchema: CarbonFootprintPredictionInputSchema,
    outputSchema: CarbonFootprintPredictionOutputSchema,
  },
  async input => {
    const {output} = await carbonFootprintPredictionPrompt(input);
    return output!;
  }
);
