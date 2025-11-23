'use server';

/**
 * @fileOverview A flow to recommend an image filter style based on the user's mood.
 *
 * - recommendImageFilter - A function that recommends an image filter style based on the mood.
 * - RecommendImageFilterInput - The input type for the recommendImageFilter function.
 * - RecommendImageFilterOutput - The return type for the recommendImageFilter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendImageFilterInputSchema = z.object({
  mood: z.string().describe('The mood of the user (e.g., happy, sad, angry).'),
});
export type RecommendImageFilterInput = z.infer<typeof RecommendImageFilterInputSchema>;

const RecommendImageFilterOutputSchema = z.object({
  filterSuggestion: z
    .string()
    .describe(
      'A suggestion for an image filter style that complements the mood (e.g., Soft blur + purple tint, VHS noise, Teal-orange cinematic, Dreamy glow, Dark noir).'
    ),
});
export type RecommendImageFilterOutput = z.infer<typeof RecommendImageFilterOutputSchema>;

export async function recommendImageFilter(input: RecommendImageFilterInput): Promise<RecommendImageFilterOutput> {
  return recommendImageFilterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendImageFilterPrompt',
  input: {schema: RecommendImageFilterInputSchema},
  output: {schema: RecommendImageFilterOutputSchema},
  prompt: `You are MoodPic AI, designed to create viral and highly emotional visual experiences for teens and TikTokers based on their mood.

  Based on the mood, suggest an image filter style to apply over the user’s image.

  Mood: {{{mood}}}

  Filter Suggestion:`,
});

const recommendImageFilterFlow = ai.defineFlow(
  {
    name: 'recommendImageFilterFlow',
    inputSchema: RecommendImageFilterInputSchema,
    outputSchema: RecommendImageFilterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
