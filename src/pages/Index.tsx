import { useState, useEffect } from "react";
import { ScriptInput } from "@/components/ScriptInput";
import { ScriptControls } from "@/components/ScriptControls";
import { ScriptOutput } from "@/components/ScriptOutput";
import { ApiKeySetup } from "@/components/ApiKeySetup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Target, Key } from "lucide-react";
import { generateScript } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");
  const [scriptInput, setScriptInput] = useState("");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState<string[]>([]);
  const [tone, setTone] = useState("");
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState("medium");
  const [format, setFormat] = useState("Instagram Reel");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Output state
  const [generatedScript, setGeneratedScript] = useState("");
  const [shotList, setShotList] = useState<string[]>([]);
  const [bgmSuggestions, setBgmSuggestions] = useState<string[]>([]);
  const [ctaVariants, setCtaVariants] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0);

  // Check for existing API key on component mount
  useEffect(() => {
    try {
      const storedApiKey = localStorage.getItem("openrouter_api_key");
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerate = async () => {
    if (!scriptInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your script idea or topic.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const result = await generateScript({
        scriptInput,
        niche,
        audience,
        tone,
        language,
        length,
        format
      });
      
      setGeneratedScript(result.script);
      setShotList(result.shotList);
      setBgmSuggestions(result.bgmSuggestions);
      setCtaVariants(result.ctaVariants);
      setSummary(result.summary);
      setEstimatedTime(result.estimatedTime);
      
      toast({
        title: "Script Generated!",
        description: "Your AI-powered script is ready.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-glass-foreground">Loading Vibe Script...</h2>
          <p className="text-muted-foreground">Please wait while we set up your experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Vibe Script
              </h1>
              <Zap className="w-8 h-8 text-secondary animate-bounce" />
            </div>
            <p className="text-xl text-glass-foreground max-w-2xl mx-auto">
              Transform raw ideas into performance-ready scripts with AI-powered Tamil, Thanglish & English content generation
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">12</div>
                <div className="text-sm text-muted-foreground">Script Tones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Formats</div>
              </div>
            </div>
            
            {/* API Key Status */}
            {apiKey && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <Key className="w-4 h-4" />
                API Key Configured
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {!apiKey ? (
          /* API Key Setup Section */
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-glass-foreground mb-2">
                Get Started with Vibe Script
              </h2>
              <p className="text-muted-foreground">
                Enter your OpenRouter API key to unlock AI-powered script generation
              </p>
            </div>
            <ApiKeySetup onApiKeySet={setApiKey} />
          </div>
        ) : (
          /* Main Script Generation Interface */
          <>
            {/* Input Section */}
            <div className="animate-slide-up">
              <ScriptInput value={scriptInput} onChange={setScriptInput} />
            </div>

            {/* Controls Section */}
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <ScriptControls
                niche={niche}
                setNiche={setNiche}
                audience={audience}
                setAudience={setAudience}
                tone={tone}
                setTone={setTone}
                language={language}
                setLanguage={setLanguage}
                length={length}
                setLength={setLength}
                format={format}
                setFormat={setFormat}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

            {/* Output Section */}
            {(generatedScript || isGenerating) && (
              <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                {isGenerating ? (
                  <Card className="bg-gradient-glass backdrop-blur-md border-glass-border shadow-glass p-12 rounded-2xl text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
                        <Sparkles className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-glass-foreground">Generating Your Script...</h3>
                      <p className="text-muted-foreground">
                        AI is crafting your {tone.toLowerCase()} {language} script for {format.toLowerCase()}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Target className="w-4 h-4" />
                        Targeting: {audience.join(", ") || "General audience"}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <ScriptOutput
                    script={generatedScript}
                    onScriptChange={setGeneratedScript}
                    shotList={shotList}
                    bgmSuggestions={bgmSuggestions}
                    ctaVariants={ctaVariants}
                    summary={summary}
                    estimatedTime={estimatedTime}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            Built with ❤️ for content creators • Powered by OpenRouter AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;