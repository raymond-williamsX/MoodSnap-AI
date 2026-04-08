'use client';

import { useState } from 'react';
import { MoodForm } from '@/components/mood-form';
import { MoodResult } from '@/components/mood-result';
import { Logo } from '@/components/logo';
import type { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood';

const stats = [
  { label: 'Mood reads', value: '1.2M+' },
  { label: 'Insight speed', value: '2.9s' },
  { label: 'Mood match', value: '93%' },
];

const roadmap = [
  {
    title: 'Mood journaling',
    detail: 'Let users save every read, revisit timelines, and track streaks for self-reflection.',
  },
  {
    title: 'Guided prompts',
    detail: 'Layer AI nudges on top of each mood to recommend micro-actions, playlists, or meditations.',
  },
  {
    title: 'Share-ready stories',
    detail: 'Export cinematic cards for socials or let friends send back reactions to your vibe.',
  },
];

const contactMethods = [
  { label: 'Email', value: 'hello@moodsnap.ai' },
  { label: 'Instagram', value: '@moodsnap.ai' },
  { label: 'Discord', value: 'moodsnap#0192' },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [moodPackage, setMoodPackage] = useState<AnalyzeMoodOutput | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const year = new Date().getFullYear();

  const handleReset = () => {
    setLoading(false);
    setMoodPackage(null);
    setUserImage(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),_transparent_65%)] blur-3xl" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 lg:py-16">
        <header className="space-y-6 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <div className="rounded-full border border-white/30 bg-white/10 p-2">
              <Logo />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">MoodSnap AI</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A premium AI companion for how you feel in the moment.
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-white/70 lg:mx-0">
              Share a sentence or a photo and the system returns a cinematic mood package with quotes, mood
              type, and visuals you can share.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="uppercase tracking-[0.2em] text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-1">
            <div className="rounded-3xl bg-slate-950/90 p-6 shadow-[0_25px_90px_rgba(15,23,42,0.65)]">
              {!moodPackage ? (
                <MoodForm
                  setLoading={setLoading}
                  setMoodPackage={setMoodPackage}
                  setUserImage={setUserImage}
                  loading={loading}
                />
              ) : (
                <MoodResult moodPackage={moodPackage} userImage={userImage} onReset={handleReset} />
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Future upgrades</p>
              <h2 className="mt-3 text-2xl font-semibold">Roadmap ideas</h2>
              <div className="mt-6 space-y-4">
                {roadmap.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-white/60">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/20 to-rose-500/20 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">Why MoodSnap?</p>
              <h3 className="mt-3 text-2xl font-semibold">A cinematic pulse-check anytime</h3>
              <p className="mt-3 text-sm text-white/70">
                We blend narrative prompts with expressive visuals so you can not only name your mood, but craft a
                shareable moment. Keep exploring more moods, keep building your vibe profile.
              </p>
            </div>
          </aside>
        </section>

        <footer className="border-t border-white/10 pt-6 text-sm text-white/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="uppercase tracking-[0.4em] text-white/60">MoodSnap AI</p>
            <p>© {year} MoodSnap AI. Crafted with care.</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-white/70">
            {contactMethods.map((method) => (
              <div key={method.label} className="flex gap-2">
                <span className="text-white/50">{method.label}:</span>
                <span className="text-white">{method.value}</span>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
