import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, Edit3, Download, Copy, Share2, Clock, 
  Camera, Music, Lightbulb, FileText, Monitor 
} from "lucide-react";

interface ScriptOutputProps {
  script: string;
  onScriptChange: (script: string) => void;
  shotList: string[];
  bgmSuggestions: string[];
  ctaVariants: string[];
  summary: string;
  estimatedTime: number;
}

export function ScriptOutput({
  script,
  onScriptChange,
  shotList,
  bgmSuggestions,
  ctaVariants,
  summary,
  estimatedTime
}: ScriptOutputProps) {
  const [view, setView] = useState<"clean" | "detailed" | "performer">("clean");
  const [editedCleanScript, setEditedCleanScript] = useState<string>("");

  // Load edited clean script from localStorage if it exists
  React.useEffect(() => {
    const saved = localStorage.getItem('vibe_script_clean_edit');
    if (saved) {
      setEditedCleanScript(saved);
    }
  }, []);

  const copyToClipboard = () => {
    const textToCopy = view === "clean" ? performanceReadyScript : actualScript;
    navigator.clipboard.writeText(textToCopy);
  };

  const exportScript = (format: string) => {
    const element = document.createElement("a");
    const textToExport = view === "clean" ? performanceReadyScript : actualScript;
    const file = new Blob([textToExport], { type: "text/plain" });
    const fileName = view === "clean" ? "vibe-script-clean" : "vibe-script-detailed";
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Parse the script data and extract clean content
  const parseScriptData = (scriptText: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(scriptText);
      if (parsed.script) {
        return parsed.script;
      }
      // If no script field, return the whole content
      return scriptText;
    } catch (error) {
      // If not JSON, treat as plain text
      return scriptText;
    }
  };

  // Get the actual script content
  const actualScript = parseScriptData(script);

  // Clean script without any technical annotations
  const cleanScript = actualScript
    .replace(/\[.*?\]/g, '') // Remove all bracketed content
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
    .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
    .replace(/\\"/g, '"') // Convert escaped quotes to actual quotes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n\s+/g, '\n') // Clean up line breaks
    .replace(/\{.*?"script":\s*/, '') // Remove JSON wrapper
    .replace(/\}\s*$/, '') // Remove trailing JSON
    .replace(/pause:\s*\d+s/gi, '\n\n[PAUSE]\n\n') // Replace pauses with clear pause markers
    .replace(/\s+/g, ' ') // Normalize whitespace again
    .trim();

  // Use edited clean script if available, otherwise use generated clean script
  const displayCleanScript = editedCleanScript || cleanScript;

  // Function to make script performance-ready
  const makePerformanceReady = (scriptText: string) => {
    return scriptText
      .replace(/\n\s*\n/g, '\n\n') // Normalize double line breaks
      .replace(/([.!?])\s+/g, '$1\n\n') // Add line breaks after sentences
      .replace(/\n{3,}/g, '\n\n') // Limit to max 2 consecutive line breaks
      .trim();
  };

  // Performance-ready version of the clean script
  const performanceReadyScript = makePerformanceReady(displayCleanScript);

  // Function to render detailed script with colored formatting
  const renderDetailedScript = (scriptText: string) => {
    // First clean up the text for better display
    const cleanedText = scriptText
      .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
      .replace(/\\"/g, '"') // Convert escaped quotes to actual quotes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Split the script into parts and apply single color formatting
    const parts = cleanedText.split(/(\[.*?\])/g);
    
    return (
      <div className="whitespace-pre-wrap leading-relaxed">
        {parts.map((part, index) => {
          if (part.match(/^\[.*?\]$/)) {
            // All technical annotations use the same color (blue)
            return <span key={index} className="text-blue-600 font-semibold bg-blue-50 px-1 rounded">{part}</span>;
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Output Header */}
      <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-4 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-glass-foreground">Generated Script</h2>
            <Badge variant="secondary" className="rounded-xl flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ~{estimatedTime}s
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={view === "clean" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("clean")}
            >
              <FileText className="w-4 h-4" />
              Clean Script
            </Button>
            <Button
              variant={view === "detailed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("detailed")}
            >
              <Edit3 className="w-4 h-4" />
              Detailed Script
            </Button>
            <Button
              variant={view === "performer" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("performer")}
            >
              <Monitor className="w-4 h-4" />
              Performer View
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Script Editor */}
        <div className="lg:col-span-2">
          <Card className="bg-editor border-glass-border shadow-glass rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-glass-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Legend for detailed view */}
                  {view === "detailed" && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-blue-100 rounded"></span>
                        Technical Annotations
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => exportScript("txt")}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {view === "clean" ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Clean script without technical annotations. Edit this to update your script.
                  </div>
                  <Textarea
                    value={performanceReadyScript}
                    onChange={(e) => {
                      const newCleanScript = e.target.value;
                      setEditedCleanScript(newCleanScript);
                      localStorage.setItem('vibe_script_clean_edit', newCleanScript);
                    }}
                    className="min-h-[400px] bg-transparent border-none text-editor-foreground text-base leading-relaxed resize-none focus-visible:ring-0 font-mono"
                    placeholder="Your clean script will appear here..."
                  />
                </div>
              ) : view === "detailed" ? (
                <div className="min-h-[400px] bg-transparent text-editor-foreground text-base leading-relaxed font-mono">
                  {renderDetailedScript(actualScript) || "Your detailed script will appear here..."}
                </div>
              ) : (
                <div className="min-h-[400px] bg-transparent text-editor-foreground text-2xl leading-relaxed font-sans tracking-wide">
                  {performanceReadyScript || "Your teleprompter view will appear here..."}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Tabs defaultValue="shots" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-glass/40 rounded-xl">
              <TabsTrigger value="shots" className="rounded-lg">
                <Camera className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="bgm" className="rounded-lg">
                <Music className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="cta" className="rounded-lg">
                <Lightbulb className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="summary" className="rounded-lg">
                <FileText className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="shots" className="mt-4">
              <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-4 rounded-2xl">
                <h3 className="font-semibold text-glass-foreground mb-3">Shot List</h3>
                <div className="space-y-2">
                  {shotList.length > 0 ? shotList.map((shot, index) => (
                    <div key={index} className="text-sm text-glass-foreground bg-editor-surface/50 p-2 rounded-lg">
                      {shot}
                    </div>
                  )) : (
                    <div className="text-sm text-muted-foreground">
                      Shot suggestions will appear here after generation
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="bgm" className="mt-4">
              <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-4 rounded-2xl">
                <h3 className="font-semibold text-glass-foreground mb-3">BGM Suggestions</h3>
                <div className="space-y-2">
                  {bgmSuggestions.length > 0 ? bgmSuggestions.map((bgm, index) => (
                    <div key={index} className="text-sm text-glass-foreground bg-editor-surface/50 p-2 rounded-lg">
                      {bgm}
                    </div>
                  )) : (
                    <div className="text-sm text-muted-foreground">
                      BGM suggestions will appear here after generation
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="cta" className="mt-4">
              <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-4 rounded-2xl">
                <h3 className="font-semibold text-glass-foreground mb-3">CTA Variants</h3>
                <div className="space-y-2">
                  {ctaVariants.length > 0 ? ctaVariants.map((cta, index) => (
                    <div key={index} className="text-sm text-glass-foreground bg-editor-surface/50 p-2 rounded-lg cursor-pointer hover:bg-editor-surface/70 transition-colors">
                      {cta}
                    </div>
                  )) : (
                    <div className="text-sm text-muted-foreground">
                      CTA variants will appear here after generation
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary" className="mt-4">
              <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-4 rounded-2xl">
                <h3 className="font-semibold text-glass-foreground mb-3">TL;DR Summary</h3>
                <div className="text-sm text-glass-foreground bg-editor-surface/50 p-3 rounded-lg">
                  {summary || "Script summary will appear here after generation"}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}