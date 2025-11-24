'use client';

import { useState } from 'react';
import { MoodForm } from '@/components/mood-form';
import { MoodResult } from '@/components/mood-result';
import { Logo } from '@/components/logo';
import type { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [moodPackage, setMoodPackage] = useState<AnalyzeMoodOutput | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);

  const handleReset = () => {
    setLoading(false);
    setMoodPackage(null);
    setUserImage(null);
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center min-h-screen">
      <header className="w-full max-w-2xl text-center mb-8 md:mb-12">
        <Logo />
        <h1 className="text-4xl md:text-5xl font-bold font-headline mt-4 text-primary">
          MoodPix AI
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Let AI read your vibe. Get a personalized mood package in seconds.
        </p>
      </header>
      <div className="w-full max-w-2xl">
        {!moodPackage ? (
          <MoodForm
            setLoading={setLoading}
            setMoodPackage={setMoodPackage}
            setUserImage={setUserImage}
            loading={loading}
          />
        ) : (
          <MoodResult
            moodPackage={moodPackage}
            userImage={userImage}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
