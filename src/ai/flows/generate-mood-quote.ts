'use server';

/**
 * @fileOverview AI agent that generates a short, relatable quote based on the analyzed mood.
 *
 * - generateMoodQuote - A function that handles the quote generation process.
 * - GenerateMoodQuoteInput - The input type for the generateMoodQuote function.
 * - GenerateMoodQuoteOutput - The return type for the generateMoodQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoodQuoteInputSchema = z.object({
  mood: z.string().describe('The mood to generate a quote for.'),
});
export type GenerateMoodQuoteInput = z.infer<typeof GenerateMoodQuoteInputSchema>;

const GenerateMoodQuoteOutputSchema = z.object({
  quote: z.string().describe('A short, relatable quote based on the mood.'),
});
export type GenerateMoodQuoteOutput = z.infer<typeof GenerateMoodQuoteOutputSchema>;

export async function generateMoodQuote(input: GenerateMoodQuoteInput): Promise<GenerateMoodQuoteOutput> {
  return generateMoodQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMoodQuotePrompt',
  input: {schema: GenerateMoodQuoteInputSchema},
  output: {schema: GenerateMoodQuoteOutputSchema},
  prompt: `You are MoodPic AI, designed to create viral and highly emotional visual experiences for teens and TikTokers based on their mood.\n\nYou will generate a short, deep, or relatable quote that matches the mood. It must be Gen Z/TikTok friendly, dramatic or aesthetic. Example: "They don’t miss you when they’re healed." or "Smile now, cry later."\n\nMood: {{{mood}}}\nQuote: `,
});

const generateMoodQuoteFlow = ai.defineFlow(
  {
    name: 'generateMoodQuoteFlow',
    inputSchema: GenerateMoodQuoteInputSchema,
    outputSchema: GenerateMoodQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
