import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  const [detectedLanguage, setDetectedLanguage] = useState("English");
  
  const detectLanguage = (text: string) => {
    // Simple language detection
    if (/[\u0B80-\u0BFF]/.test(text)) {
      setDetectedLanguage("Tamil");
    } else if (/[a-zA-Z]/.test(text) && /[கசணதமயரலவ]/.test(text)) {
      setDetectedLanguage("Thanglish");
    } else {
      setDetectedLanguage("English");
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    detectLanguage(newValue);
  };

  return (
    <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-6 rounded-2xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-glass-foreground">Script Input</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-xl">
              {detectedLanguage}
            </Badge>
            <Badge variant="outline" className="rounded-xl text-xs">
              {value.length} chars
            </Badge>
          </div>
        </div>
        
        <Textarea
          placeholder="Paste your raw script, idea, or content here... (Tamil / Thanglish / English supported)"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[200px] bg-editor-surface border-glass-border text-editor-foreground placeholder:text-muted-foreground rounded-2xl resize-none text-base leading-relaxed"
        />
        
        <div className="text-sm text-muted-foreground">
          💡 Tip: Paste your raw thoughts, scripts, or ideas. The AI will transform them into performance-ready content.
        </div>
      </div>
    </Card>
  );
}