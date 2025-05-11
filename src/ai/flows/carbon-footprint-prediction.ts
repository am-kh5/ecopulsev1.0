// Carbon footprint prediction flow
'use server';
/**
 * @fileOverview Predicts carbon footprint, assesses it, and provides advice.
 *
 * - carbonFootprintPrediction - A function that predicts carbon footprint, assesses it, and provides advice.
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
  currentRecyclingRate: z.number().optional().describe('Current recycling rate as a percentage (0-100). Sourced from dashboard data.'),
  currentRenewableEnergyMix: z.number().optional().describe('Current renewable energy mix as a percentage (0-100). Sourced from dashboard data.'),
});
export type CarbonFootprintPredictionInput = z.infer<typeof CarbonFootprintPredictionInputSchema>;

const CarbonFootprintPredictionOutputSchema = z.object({
  predictedMonthlyFootprint: z.number().describe('Predicted monthly carbon footprint in tons of CO2 equivalent for the company based on the provided data.'),
  footprintAssessment: z.string().describe('Overall assessment of the footprint (e.g., "High", "Moderate", "Low", "Very High", "Very Low").'),
  improvementAdvice: z.array(z.string()).optional().describe('List of actionable advice points to reduce the carbon footprint. Provided if assessment suggests room for improvement. Each string is a separate piece of advice.'),
  positiveRemarks: z.array(z.string()).optional().describe('List of positive remarks if the footprint is assessed positively or specific inputs indicate good practices. Each string is a separate remark.'),
  projectedAnnualFootprint: z.number().describe('Projected annual carbon footprint based on the monthly prediction (monthly footprint * 12).'),
});
export type CarbonFootprintPredictionOutput = z.infer<typeof CarbonFootprintPredictionOutputSchema>;

export async function carbonFootprintPrediction(input: CarbonFootprintPredictionInput): Promise<CarbonFootprintPredictionOutput> {
  return carbonFootprintPredictionFlow(input);
}

const carbonFootprintPredictionPrompt = ai.definePrompt({
  name: 'carbonFootprintPredictionPrompt',
  input: {schema: CarbonFootprintPredictionInputSchema},
  output: {schema: CarbonFootprintPredictionOutputSchema},
  prompt: `You are an expert AI environmental consultant specializing in corporate carbon footprints.
Based on the provided current monthly operational data and dashboard metrics for a company, you need to:
1. Calculate the \`predictedMonthlyFootprint\` in tons of CO2 equivalent.
2. Provide a \`footprintAssessment\` (e.g., "Very High", "High", "Moderate", "Low", "Very Low") for this monthly footprint. Consider the company size and other provided metrics like current recycling rate and renewable energy mix to infer typical industry benchmarks (assume general office-based business or light manufacturing).
3. Based on the assessment and all input values (including energy, travel, waste, recycling rate, renewable energy mix):
    - If the assessment is 'Very High', 'High' or 'Moderate', or if specific inputs seem notably high/low for the company size context, provide 3-5 actionable \`improvementAdvice\` points. These should be specific and practical. Examples:
        - "Consider switching to LED lighting to reduce energy consumption by an estimated X%."
        - "Implement a remote work policy for X days a week to reduce travel emissions."
        - "Conduct a waste audit to identify key areas for reduction and recycling. Your current recycling rate is {{currentRecyclingRate}}%." (Mention if provided and relevant)
        - "Explore options to increase your renewable energy mix from the current {{currentRenewableEnergyMix}}%. Sourcing X% more renewable energy could reduce emissions by Y." (Mention if provided and relevant)
    - If the assessment is 'Low' or 'Very Low' and inputs indicate good practices, provide 1-3 concise \`positiveRemarks\`. Examples:
        - "Your company's energy consumption is commendably low for its size."
        - "The current waste generation level suggests effective reduction measures are in place."
        - "Your current recycling rate of {{currentRecyclingRate}}% is excellent and significantly contributes to a lower environmental impact." (Mention if provided and relevant)
        - "Utilizing {{currentRenewableEnergyMix}}% renewable energy is a strong positive factor in your carbon footprint." (Mention if provided and relevant)
4. Calculate the \`projectedAnnualFootprint\` based on the predicted monthly footprint (predictedMonthlyFootprint * 12).

Company operational and dashboard data:
- Monthly energy consumption: {{{energyConsumption}}} kWh
- Monthly travel distance: {{{travelDistance}}} km
- Monthly waste generation: {{{wasteGeneration}}} kg
- Number of employees: {{{companySize}}}
{{#if currentRecyclingRate}}
- Current Recycling Rate: {{{currentRecyclingRate}}}%
{{/if}}
{{#if currentRenewableEnergyMix}}
- Current Renewable Energy Mix: {{{currentRenewableEnergyMix}}}%
{{/if}}

Ensure your response strictly adheres to the output schema. Be realistic with estimations in advice.
If providing advice, focus on the most impactful changes first. Incorporate the recycling rate and renewable energy mix into your advice or remarks where appropriate.
If providing positive remarks, be specific about what they are doing well, referencing the provided metrics if available.
Avoid conversational fluff; stick to the requested outputs.
Example for advice: "Invest in smart thermostats to optimize HVAC energy use, potentially saving 5-10% on heating/cooling costs."
Example for positive remark: "Maintaining low travel distances per employee significantly contributes to your positive footprint."
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
