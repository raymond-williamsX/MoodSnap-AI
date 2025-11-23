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
import { Camera, FileText, Loader2, Upload } from 'lucide-react';
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

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle>How are you feeling?</CardTitle>
        <CardDescription>Share your mood through words or a photo.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text"><FileText className="mr-2 h-4 w-4" />Write it out</TabsTrigger>
            <TabsTrigger value="photo"><Camera className="mr-2 h-4 w-4" />Upload a photo</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <TabsContent value="text">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Describe your mood</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., feeling heartbroken but hopeful..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                          className="relative flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
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
                            <Image src={imagePreview} alt="Preview" fill className="rounded-lg object-contain" />
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <Upload className="mx-auto h-10 w-10 mb-2" />
                              <p>Click to upload or drag and drop</p>
                              <p className="text-xs">PNG, JPG, WEBP up to 4MB</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Generate Mood'
                )}
              </Button>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
