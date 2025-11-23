// src/ai/flows/analyze-mood.ts
'use server';
/**
 * @fileOverview A flow to analyze mood from a photo and return a Mood Package.
 *
 * - analyzeMoodFromPhoto - Analyzes the mood from a photo.
 * - AnalyzeMoodInput - The input type for analyzeMoodFromPhoto.
 * - AnalyzeMoodOutput - The output type for analyzeMoodFromPhoto.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMoodInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMoodInput = z.infer<typeof AnalyzeMoodInputSchema>;

const AnalyzeMoodOutputSchema = z.object({
  mood: z.string().describe('The mood in 1 word (e.g., happy, sad, heartbroken).'),
  quote: z.string().describe('A short, deep, or relatable quote that matches the mood.'),
  emoji: z.string().describe('One or two emojis that match the mood and vibe.'),
  moodType: z.enum([
    'Sad',
    'Happy',
    'Angry',
    'In Love',
    'Motivated',
    'Lost',
    'Confident',
    'Depressed',
    'Confused',
    'Chill',
    'Excited',
    'Shy',
    'Heartbroken',
    'Dreamy',
  ]).describe('One of the mood categories.'),
  backgroundStyle: z.string().describe('An aesthetic background theme that matches the mood.'),
  filterSuggestion: z.string().describe('A filter style to apply over the user’s image.'),
});
export type AnalyzeMoodOutput = z.infer<typeof AnalyzeMoodOutputSchema>;

export async function analyzeMoodFromPhoto(input: AnalyzeMoodInput): Promise<AnalyzeMoodOutput> {
  return analyzeMoodFlow(input);
}

const analyzeMoodPrompt = ai.definePrompt({
  name: 'analyzeMoodPrompt',
  input: {schema: AnalyzeMoodInputSchema},
  output: {schema: AnalyzeMoodOutputSchema},
  prompt: `You are MoodPic AI, designed to create viral and highly emotional visual experiences for teens and TikTokers based on their mood.

You will receive a photo of the user. Your job is to analyze the facial expression and overall image context to determine their mood. Return a "Mood Package" that includes the following:

1.  Mood: Describe the mood in 1 word (e.g., happy, sad, heartbroken, hyped, broken, lonely, dreamy, in love).
2.  Mood Quote: A short, deep, or relatable quote that matches the mood. It must be Gen Z/TikTok friendly, dramatic or aesthetic. Example: "They don’t miss you when they’re healed." or "Smile now, cry later."
3.  Emoji: One or two emojis that match the mood and vibe.
4.  Mood Type: Pick one of the mood categories: {Sad, Happy, Angry, In Love, Motivated, Lost, Confident, Depressed, Confused, Chill, Excited, Shy, Heartbroken, Dreamy}
5.  Background Style: Choose an aesthetic background theme that matches the mood. Examples: "neon purple haze", "blue rainy gradient", "aesthetic sunset", "urban black-and-white", "glitchcore", "cozy pastel", "vaporwave".
6.  Image Filter Suggestion: Suggest a filter style to apply over the user’s image. Examples: “Soft blur + purple tint”, “VHS noise”, “Teal-orange cinematic”, “Dreamy glow”, “Dark noir”.

You must format your response as JSON.

Photo: {{media url=photoDataUri}}`,
});

const analyzeMoodFlow = ai.defineFlow(
  {
    name: 'analyzeMoodFlow',
    inputSchema: AnalyzeMoodInputSchema,
    outputSchema: AnalyzeMoodOutputSchema,
  },
  async input => {
    const {output} = await analyzeMoodPrompt(input);
    return output!;
  }
);
