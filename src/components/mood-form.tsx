'use client';

import { useState, useRef, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyzeTextAction, analyzePhotoAction } from '@/app/actions';
import type { AnalyzeMoodOutput } from '@/ai/flows/analyze-mood';
import { useToast } from '@/hooks/use-toast';
import { Camera, FileText, Loader2, Upload, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  text: z.string().optional(),
  photo: z.any().optional(),
});

type MoodFormProps = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMoodPackage: Dispatch<SetStateAction<AnalyzeMoodOutput | null>>;
  setUserImage: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
};

export function MoodForm({ setLoading, setMoodPackage, setUserImage, loading }: MoodFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let result: AnalyzeMoodOutput | null = null;
      if (activeTab === 'text') {
        if (!values.text || values.text.trim().length < 3) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please describe your mood in a few words.' });
          setLoading(false);
          return;
        }
        result = await analyzeTextAction(values.text);
        setUserImage(null);
      } else if (activeTab === 'photo') {
        if (!imagePreview) {
          toast({ variant: 'destructive', title: 'Error', description: 'Please upload a photo.' });
          setLoading(false);
          return;
        }
        result = await analyzePhotoAction(imagePreview);
        setUserImage(imagePreview);
      }

      if (result) {
        setMoodPackage(result);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Oops!', description: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Please upload an image smaller than 4MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitForm = form.handleSubmit(onSubmit);
  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (loading) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitForm();
    }
  };

  return (
    <Card className="w-full shadow-[0_25px_90px_rgba(15,23,42,0.45)] border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,.12),_transparent_55%)]"></div>
      <CardHeader className="pt-10 pb-6 text-center">
        <CardTitle className="text-3xl font-semibold tracking-wide text-white">MoodSnap AI</CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-opacity-80">
          Choose your vibe input and let the AI craft a cinematic mood reveal.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Premium sensing
            </p>
            <p className="text-lg text-center font-light text-white/80">
              Self-care powered by AI + human-level aesthetics.
            </p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 rounded-full border border-white/20 bg-white/5 p-1 text-sm text-white/70">
              <TabsTrigger value="text" className="rounded-full">
                <FileText className="mr-2 h-4 w-4" /> Write it out
              </TabsTrigger>
              <TabsTrigger value="photo" className="rounded-full">
                <Camera className="mr-2 h-4 w-4" /> Upload a photo
              </TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form onSubmit={submitForm} className="space-y-6 mt-6">
                <TabsContent value="text">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Describe your mood</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell me how you feel in a sentence or two – enter submits, shift+enter adds a line."
                            className="resize-none rounded-2xl bg-white/90 text-slate-900 shadow-inner border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                            rows={4}
                            onKeyDown={handleTextKeyDown}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="mt-2 text-[0.7rem] uppercase tracking-[0.3em] text-white/50">
                          press enter to post · shift+enter for a new line
                        </p>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="photo">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div
                            className="relative flex flex-col justify-center items-center w-full h-52 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-amber-300 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/png, image/jpeg, image/webp"
                              className="hidden"
                            />
                            {imagePreview ? (
                              <Image src={imagePreview} alt="Preview" fill className="rounded-2xl object-cover" />
                            ) : (
                              <div className="text-center text-white/70 space-y-1">
                                <Upload className="mx-auto h-10 w-10 text-white" />
                                <p className="text-sm">Tap or drop a photo</p>
                                <p className="text-xs text-white/40">PNG · JPG · WEBP · ⩽ 4MB</p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <Button
                  type="submit"
                  className="w-full rounded-2xl border border-white/30 bg-gradient-to-r from-amber-400 to-rose-500 text-lg font-semibold tracking-wide text-slate-900 hover:scale-[1.01] transition-transform"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Reveal my mood
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </Tabs>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-center text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
            <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
              <Sparkles className="mx-auto h-4 w-4 text-amber-300" />
              <p>AI insight</p>
              <p className="text-xs text-white/40">Custom for you</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
              <Sparkles className="mx-auto h-4 w-4 text-sky-300" />
              <p>24h readiness</p>
              <p className="text-xs text-white/40">Always available</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3 border border-white/10">
              <Sparkles className="mx-auto h-4 w-4 text-emerald-300" />
              <p>Safe privacy</p>
              <p className="text-xs text-white/40">No data retained</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
