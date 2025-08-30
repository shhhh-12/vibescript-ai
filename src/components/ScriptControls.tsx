import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Users, Mic2, Globe, Video } from "lucide-react";

interface ScriptControlsProps {
  niche: string;
  setNiche: (value: string) => void;
  audience: string[];
  setAudience: (value: string[]) => void;
  tone: string;
  setTone: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  format: string;
  setFormat: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const niches = [
  "Love & Relationships", "Career & Business", "College Life", "Money & Finance",
  "Health & Fitness", "Comedy & Memes", "Life Hacks", "Family", "Technology", "Food"
];

const tones = [
  "Comedic", "Sarcastic", "Heartfelt", "Dramatic", "Casual", "Troll", "Edgy", "Deadpan",
  "Motivational", "Controversial", "Educational", "Storytelling"
];

const audiences = [
  "College Students", "Young Professionals", "Gen Z", "Millennials", "Content Creators",
  "Entrepreneurs", "Tamil Audience", "Urban Youth", "Working Class", "Students"
];

const formats = [
  "Instagram Reel", "YouTube Shorts", "TikTok", "Voiceover", "Podcast Snippet", "Story"
];

export function ScriptControls({
  niche, setNiche, audience, setAudience, tone, setTone,
  language, setLanguage, length, setLength, format, setFormat,
  onGenerate, isGenerating
}: ScriptControlsProps) {
  
  const toggleAudience = (aud: string) => {
    if (audience.includes(aud)) {
      setAudience(audience.filter(a => a !== aud));
    } else {
      setAudience([...audience, aud]);
    }
  };

  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-6 rounded-2xl">
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-glass-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Script Controls
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Niche */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-glass-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Niche
            </label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger className="bg-editor-surface border-glass-border rounded-xl">
                <SelectValue placeholder="Select niche" />
              </SelectTrigger>
              <SelectContent className="bg-editor-surface border-glass-border rounded-xl">
                {niches.map((n) => (
                  <SelectItem key={n} value={n} className="rounded-lg">{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-glass-foreground flex items-center gap-2">
              <Mic2 className="w-4 h-4" />
              Tone
            </label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="bg-editor-surface border-glass-border rounded-xl">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent className="bg-editor-surface border-glass-border rounded-xl">
                {tones.map((t) => (
                  <SelectItem key={t} value={t} className="rounded-lg">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-glass-foreground flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-editor-surface border-glass-border rounded-xl">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-editor-surface border-glass-border rounded-xl">
                <SelectItem value="Tamil" className="rounded-lg">Tamil</SelectItem>
                <SelectItem value="English" className="rounded-lg">English</SelectItem>
                <SelectItem value="Thanglish" className="rounded-lg">Thanglish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Length */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-glass-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Length
            </label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger className="bg-editor-surface border-glass-border rounded-xl">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent className="bg-editor-surface border-glass-border rounded-xl">
                <SelectItem value="short" className="rounded-lg">Short (20-40s)</SelectItem>
                <SelectItem value="medium" className="rounded-lg">Medium (40-60s)</SelectItem>
                <SelectItem value="long" className="rounded-lg">Long (60-90s)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-glass-foreground flex items-center gap-2">
              <Video className="w-4 h-4" />
              Format
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-editor-surface border-glass-border rounded-xl">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-editor-surface border-glass-border rounded-xl">
                {formats.map((f) => (
                  <SelectItem key={f} value={f} className="rounded-lg">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-glass-foreground">Target Audience</label>
          <div className="flex flex-wrap gap-2">
            {audiences.map((aud) => (
              <Badge
                key={aud}
                variant={audience.includes(aud) ? "default" : "outline"}
                className="cursor-pointer rounded-xl transition-all hover:scale-105"
                onClick={() => toggleAudience(aud)}
              >
                {aud}
              </Badge>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          variant="generate"
          size="hero"
          className="w-full"
        >
          {isGenerating ? "Generating..." : "✨ Generate Script"}
        </Button>
      </div>
    </Card>
  );
}