'use client';

import { useRef } from 'react';
import type { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import Image from 'next/image';
import { getBackgroundStyle, getImageFilterStyle } from '@/lib/style-utils';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';

type MoodResultProps = {
  moodPackage: AnalyzeMoodOutput;
  userImage: string | null;
  onReset: () => void;
};

export function MoodResult({ moodPackage, userImage, onReset }: MoodResultProps) {
  const resultRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const backgroundStyle = getBackgroundStyle(moodPackage.backgroundStyle);
  const imageFilterStyle = userImage ? getImageFilterStyle(moodPackage.filterSuggestion) : {};

  const handleDownload = () => {
    if (resultRef.current) {
      toPng(resultRef.current, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'moodsnap-ai.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Oops, something went wrong!', err);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not generate image for download.' });
        });
    }
  };

  const handleShare = async () => {
    if (!resultRef.current) return;

    try {
      const dataUrl = await toPng(resultRef.current, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'moodsnap-ai.png', { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My MoodSnap AI',
          text: `Check out my vibe: ${moodPackage.mood} - "${moodPackage.quote}"`,
          files: [file],
        });
      } else {
        toast({
          title: 'Sharing not supported',
          description: "Your browser doesn't support sharing files directly.",
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not prepare image for sharing.' });
    }
  };


  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
      <Card
        ref={resultRef}
        className="w-full max-w-md overflow-hidden border-0 shadow-2xl"
        style={backgroundStyle}
      >
        <CardContent className="relative p-0 aspect-square flex flex-col justify-center items-center text-center text-white">
          {userImage && (
            <Image
              src={userImage}
              alt="User's mood"
              fill
              className="object-cover"
              style={imageFilterStyle}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="z-10 p-8 flex flex-col items-center justify-end h-full w-full">
            <div className="flex-grow"></div>
            <p className="text-5xl mb-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{moodPackage.emoji}</p>
            <blockquote className="text-2xl font-semibold italic text-center" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
              “{moodPackage.quote}”
            </blockquote>
            <p className="text-lg font-bold mt-4 tracking-widest uppercase opacity-80" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
              {moodPackage.mood}
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button onClick={handleShare} size="lg">
          <Share2 className="mr-2 h-5 w-5" /> Share
        </Button>
        <Button onClick={handleDownload} size="lg" variant="secondary">
          <Download className="mr-2 h-5 w-5" /> Download
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-5 w-5" /> Create another
        </Button>
      </div>
    </div>
  );
}
