'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  analyzeMoodFromPhoto,
  AnalyzeMoodOutput,
  AnalyzeMoodInput,
} from '@/ai/flows/analyze-mood';

const AnalyzeTextInputSchema = z.object({
  text: z.string().describe('The text input from the user describing their mood.'),
});

const AnalyzeMoodOutputSchema = z.object({
  mood: z.string().describe('The mood in 1 word (e.g., happy, sad, heartbroken).'),
  quote: z.string().describe('A short, deep, or relatable quote that matches the mood.'),
  emoji: z.string().describe('One or two emojis that match the mood and vibe.'),
  moodType: z.enum([
    'Sad', 'Happy', 'Angry', 'In Love', 'Motivated', 'Lost', 'Confident', 'Depressed', 'Confused', 'Chill', 'Excited', 'Shy', 'Heartbroken', 'Dreamy',
  ]).describe('One of the mood categories.'),
  backgroundStyle: z.string().describe('An aesthetic background theme that matches the mood.'),
  filterSuggestion: z.string().describe('A filter style to apply over the user’s image.'),
});

const analyzeTextPrompt = ai.definePrompt({
    name: 'analyzeTextPrompt',
    input: { schema: AnalyzeTextInputSchema },
    output: { schema: AnalyzeMoodOutputSchema },
    prompt: `You are MoodSnap AI, designed to create viral and highly emotional visual experiences for teens and TikTokers based on their mood.

You will receive a text from the user describing how they feel. Your job is to analyze the text to determine their mood. Return a "Mood Package" that includes the following:

1.  Mood: Describe the mood in 1 word (e.g., happy, sad, heartbroken, hyped, broken, lonely, dreamy, in love).
2.  Quote: A short, deep, or relatable quote that matches the mood. It must be Gen Z/TikTok friendly, dramatic or aesthetic. Example: "They don’t miss you when they’re healed." or "Smile now, cry later."
3.  Emoji: One or two emojis that match the mood and vibe.
4.  Mood Type: Pick one of the mood categories: {Sad, Happy, Angry, In Love, Motivated, Lost, Confident, Depressed, Confused, Chill, Excited, Shy, Heartbroken, Dreamy}
5.  Background Style: Choose an aesthetic background theme that matches the mood. Examples: "neon purple haze", "blue rainy gradient", "aesthetic sunset", "urban black-and-white", "glitchcore", "cozy pastel", "vaporwave".
6.  Image Filter Suggestion: Suggest a filter style to apply over the user’s image. Examples: “Soft blur + purple tint”, “VHS noise”, “Teal-orange cinematic”, “Dreamy glow”, “Dark noir”.

You must format your response as JSON.

User's mood description: {{{text}}}`,
});

export async function analyzeTextAction(
  text: string
): Promise<AnalyzeMoodOutput> {
  const { output } = await analyzeTextPrompt({ text });
  if (!output) {
    throw new Error('Failed to analyze mood from text.');
  }
  return output;
}

export async function analyzePhotoAction(
  photoDataUri: string
): Promise<AnalyzeMoodOutput> {
  const input: AnalyzeMoodInput = { photoDataUri };
  const result = await analyzeMoodFromPhoto(input);
  return result;
}
