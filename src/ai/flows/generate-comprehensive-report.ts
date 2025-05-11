// Comprehensive report generation flow
'use server';
/**
 * @fileOverview Generates a comprehensive environmental impact report for a company.
 *
 * - generateComprehensiveReport - A function that generates a detailed report including trend analysis, emission breakdown, AI insights, and future outlook.
 * - GenerateComprehensiveReportInput - The input type for the generateComprehensiveReport function.
 * - GenerateComprehensiveReportOutput - The return type for the generateComprehensiveReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {CarbonFootprintPredictionInput} from './carbon-footprint-prediction'; // Reuse existing input type

// Define input schema based on CarbonFootprintPredictionInput for current metrics
const GenerateComprehensiveReportInputSchema = z.object({
  companyName: z.string().describe("The name of the company for which the report is generated."),
  energyConsumption: z.number().describe('Current monthly energy consumption in kWh.'),
  travelDistance: z.number().describe('Current monthly travel distance in kilometers.'),
  wasteGeneration: z.number().describe('Current monthly waste generation in kilograms.'),
  companySize: z.number().describe('Number of employees in the company.'),
  currentRecyclingRate: z.number().optional().describe('Current recycling rate as a percentage (0-100).'),
  currentRenewableEnergyMix: z.number().optional().describe('Current renewable energy mix as a percentage (0-100).'),
  reportingPeriod: z.string().describe("The period the report covers, e.g., 'Last 6 Months (January 2024 - June 2024)'."),
});
export type GenerateComprehensiveReportInput = z.infer<typeof GenerateComprehensiveReportInputSchema>;

const EmissionSourceSchema = z.object({
  name: z.string().describe("Name of the emission source, e.g., 'Energy Consumption', 'Business Travel', 'Waste Disposal', 'Industrial Processes', 'Supply Chain'. Short and descriptive."),
  value: z.number().describe("Estimated contribution to carbon footprint from this source in tons CO2e for the reporting period or based on current monthly rates annualized."),
  percentage: z.number().min(0).max(100).describe("Percentage contribution of this source to the total carbon footprint."),
});

const GenerateComprehensiveReportOutputSchema = z.object({
  reportTitle: z.string().describe("Title of the report, e.g., 'Environmental Impact Report for [CompanyName]'."),
  generatedDate: z.string().describe("Date the report was generated, in YYYY-MM-DD format."),
  periodCovered: z.string().describe("The reporting period covered by this analysis."),
  executiveSummary: z.string().describe("A high-level overview of the company's environmental performance during the period, highlighting key trends and overall status. (3-4 sentences)."),
  keyMetricsTrendAnalysis: z.object({
    carbonFootprint: z.string().describe("Textual analysis of carbon footprint trends. If only current data is available, discuss potential historical trends based on current performance. (2-3 sentences)"),
    energyConsumption: z.string().describe("Textual analysis of energy consumption trends. (2-3 sentences)"),
    waterUsage: z.string().describe("Textual analysis of water usage trends and impact. (2-3 sentences)"),
    wasteGeneration: z.string().describe("Textual analysis of waste generation and recycling trends. (2-3 sentences)"),
  }).describe("Textual analysis condensing potential chart data into insights. Focus on interpreting what the trends mean."),
  carbonEmissionBreakdown: z.object({
    analysisText: z.string().describe("Detailed textual analysis identifying the primary sources of carbon emissions and their impact. This should clearly state the main cause(s) and offer brief insights into why they are significant. (4-5 sentences)."),
    sourceData: z.array(EmissionSourceSchema).min(3).max(5).describe("Data for a pie chart showing the breakdown of carbon emissions by major source (e.g., Energy, Travel, Waste, Operations). Ensure percentages sum to 100."),
  }).describe("The most critical section. Provide a clear breakdown of emission sources."),
  aiInsightsAndRecommendations: z.object({
    currentAssessment: z.string().describe("AI's overall assessment of the company's current carbon footprint (e.g., Very High, High, Moderate, Low, Very Low) based on the input metrics."),
    improvementAdvice: z.array(z.string()).min(2).max(4).optional().describe("Actionable advice from AI to reduce carbon footprint, if applicable. Prioritize the most impactful advice."),
    positiveRemarks: z.array(z.string()).min(1).max(3).optional().describe("Positive remarks from AI if performance is good in certain areas."),
  }).describe("Insights derived from an AI carbon footprint prediction model and analysis."),
  futureOutlookProjection: z.string().describe("Textual summary of the AI-driven 6-month carbon footprint projection, explaining the expected trend and factors influencing it. (2-3 sentences)."),
});
export type GenerateComprehensiveReportOutput = z.infer<typeof GenerateComprehensiveReportOutputSchema>;


export async function generateComprehensiveReport(input: GenerateComprehensiveReportInput): Promise<GenerateComprehensiveReportOutput> {
  return generateComprehensiveReportFlow(input);
}

const generateComprehensiveReportPrompt = ai.definePrompt({
  name: 'generateComprehensiveReportPrompt',
  input: {schema: GenerateComprehensiveReportInputSchema},
  output: {schema: GenerateComprehensiveReportOutputSchema},
  prompt: `You are an expert AI environmental consultant. Generate a comprehensive environmental impact report for {{companyName}} covering the period: {{reportingPeriod}}.
Current operational data:
- Monthly energy consumption: {{energyConsumption}} kWh
- Monthly travel distance: {{travelDistance}} km
- Monthly waste generation: {{wasteGeneration}} kg
- Number of employees: {{companySize}}
{{#if currentRecyclingRate~}}
- Current Recycling Rate: {{currentRecyclingRate}}%
{{/if~}}
{{#if currentRenewableEnergyMix~}}
- Current Renewable Energy Mix: {{currentRenewableEnergyMix}}%
{{/if~}}

Based on this data and general environmental knowledge:

1.  **Report Meta:**
    *   `reportTitle`: "Environmental Impact Report for {{companyName}}"
    *   `generatedDate`: Current date in YYYY-MM-DD format.
    *   `periodCovered`: Use "{{reportingPeriod}}".

2.  **Executive Summary (`executiveSummary`):**
    *   Provide a 3-4 sentence high-level overview of the company's environmental performance. Mention overall status (e.g., areas of concern, areas of strength).

3.  **Key Metrics Trend Analysis (`keyMetricsTrendAnalysis`):**
    *   For `carbonFootprint`, `energyConsumption`, `waterUsage`, and `wasteGeneration`:
        *   Provide a 2-3 sentence textual analysis for each.
        *   Discuss likely trends over the past 6 months. If current figures are high/low for the company size, infer that this has likely been a trend.
        *   Example for carbon footprint: "The company's current operational data suggests its carbon footprint is [high/moderate/low]. Over the past six months, this likely means [a consistent challenge/a recent improvement/steady performance] in managing emissions."

4.  **Carbon Emission Breakdown (`carbonEmissionBreakdown`):** THIS IS THE MOST IMPORTANT SECTION.
    *   `analysisText` (4-5 sentences):
        *   Identify the primary sources of carbon emissions for the company based on the provided data (energy, travel, waste, and general operations based on company size).
        *   Clearly state the **main cause(s)** of emissions.
        *   Explain why these sources are significant for this company profile.
    *   `sourceData` (array of 3-5 items for a pie chart):
        *   Estimate the breakdown of the total carbon footprint by major sources. Example sources: 'Energy Consumption', 'Business Travel', 'Waste Disposal', 'General Operations'.
        *   For each source, provide:
            *   `name`: Short, descriptive name.
            *   `value`: Estimated annual carbon footprint contribution from this source in tons CO2e (you'll need to estimate this based on inputs; be illustrative).
            *   `percentage`: Percentage contribution to the total. Ensure percentages roughly sum to 100%.
        *   Focus on making this breakdown insightful. The 'value' can be an estimated annual figure derived from the monthly inputs. For example, if energy is high, it should have a high percentage and value.

5.  **AI Insights and Recommendations (`aiInsightsAndRecommendations`):**
    *   `currentAssessment`: Provide an assessment of the company's current overall carbon footprint (e.g., "High", "Moderate", "Low") based on the input metrics and company size.
    *   `improvementAdvice` (2-4 points, optional): If the assessment is 'High' or 'Moderate', provide specific, actionable advice. Focus on the main emission sources identified.
    *   `positiveRemarks` (1-3 points, optional): If the assessment is 'Low' or there are commendable inputs (e.g., high recycling rate, high renewable mix), provide positive remarks.

6.  **Future Outlook Projection (`futureOutlookProjection`):**
    *   Provide a 2-3 sentence textual summary of a conceptual 6-month carbon footprint projection.
    *   If advice was given, suggest a potential slight decreasing trend if advice is implemented.
    *   If performance is already good, suggest a stable or slightly improving trend.

Ensure all text is professional, concise, and directly addresses the company's situation based on the provided metrics. The `carbonEmissionBreakdown.sourceData` values should be realistic estimations based on the inputs.
Assume a standard office-based or light service industry profile for {{companyName}} unless inputs strongly suggest otherwise.
The total implicit carbon footprint for the breakdown can be roughly estimated: (energyConsumption * 0.0005 + travelDistance * 0.0002 + wasteGeneration * 0.001) * 12 for an annual estimate in tons, then distribute this among sources. This is a rough guide, use your expert judgment for plausible values and percentages in the breakdown.
`,
});


const generateComprehensiveReportFlow = ai.defineFlow(
  {
    name: 'generateComprehensiveReportFlow',
    inputSchema: GenerateComprehensiveReportInputSchema,
    outputSchema: GenerateComprehensiveReportOutputSchema,
  },
  async (input) => {
    // Add current date for generatedDate
    const fullInput = {
      ...input,
      generatedDate: new Date().toISOString().split('T')[0],
    };
    const {output} = await generateComprehensiveReportPrompt(fullInput);
    return output!;
  }
);
