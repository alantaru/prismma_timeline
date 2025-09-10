'use server';

/**
 * @fileOverview Implements an AI-powered zoom tool that suggests optimal zoom levels based on the density of events and eras.
 *
 * - intelligentZoom - A function that suggests the zoom level for the timeline.
 * - IntelligentZoomInput - The input type for the intelligentZoom function.
 * - IntelligentZoomOutput - The return type for the intelligentZoom function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentZoomInputSchema = z.object({
  currentStart: z.number().describe('The current start of the visible timeline range (Unix timestamp in milliseconds).'),
  currentEnd: z.number().describe('The current end of the visible timeline range (Unix timestamp in milliseconds).'),
  totalEvents: z.number().describe('The total number of events in the current visible timeline range.'),
  totalEras: z.number().describe('The total number of eras in the current visible timeline range.'),
});
export type IntelligentZoomInput = z.infer<typeof IntelligentZoomInputSchema>;

const IntelligentZoomOutputSchema = z.object({
  suggestedZoom: z.number().describe('The suggested zoom level (higher value means more zoomed in).'),
  reason: z.string().describe('The reason for the suggested zoom level.'),
});
export type IntelligentZoomOutput = z.infer<typeof IntelligentZoomOutputSchema>;

export async function intelligentZoom(input: IntelligentZoomInput): Promise<IntelligentZoomOutput> {
  return intelligentZoomFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentZoomPrompt',
  input: {schema: IntelligentZoomInputSchema},
  output: {schema: IntelligentZoomOutputSchema},
  prompt: `You are an AI assistant that suggests optimal zoom levels for a historical timeline.

  Given the current visible timeline range, the number of events, and the number of eras, suggest a zoom level and explain your reasoning.

  The current visible timeline range starts at {{currentStart}} and ends at {{currentEnd}} (Unix timestamp in milliseconds).
  There are {{totalEvents}} events and {{totalEras}} eras in this range.

  Consider the density of events and eras when suggesting the zoom level. If there are many events and eras in a small range, suggest zooming in.
  If there are few events and eras in a large range, suggest zooming out.

  The zoom level should be a number between 1 and 10, where 1 is the most zoomed out and 10 is the most zoomed in.
`,
});

const intelligentZoomFlow = ai.defineFlow(
  {
    name: 'intelligentZoomFlow',
    inputSchema: IntelligentZoomInputSchema,
    outputSchema: IntelligentZoomOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
