import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  // Check if API key exists in localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem("openrouter_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsValid(true);
      onApiKeySet(storedApiKey);
    }
  }, [onApiKeySet]);

  const validateApiKey = async (key: string) => {
    setIsValidating(true);
    
    try {
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setIsValid(true);
        localStorage.setItem("openrouter_api_key", key);
        onApiKeySet(key);
        toast({
          title: "API Key Validated!",
          description: "Your OpenRouter API key has been successfully configured.",
        });
      } else {
        setIsValid(false);
        toast({
          title: "Invalid API Key",
          description: "Please check your OpenRouter API key and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsValid(false);
      toast({
        title: "Validation Failed",
        description: "Unable to validate API key. Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      validateApiKey(apiKey.trim());
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("openrouter_api_key");
    setApiKey("");
    setIsValid(false);
    onApiKeySet("");
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed from local storage.",
    });
  };

  if (isValid) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">API Key Configured</CardTitle>
          <CardDescription>
            Your OpenRouter API key is ready to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Key className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-mono text-gray-600">
              {apiKey.substring(0, 8)}...{apiKey.substring(apiKey.length - 4)}
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRemoveKey}
            className="w-full"
          >
            Remove API Key
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Key className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Setup OpenRouter API Key</CardTitle>
        <CardDescription>
          Enter your OpenRouter API key to start generating scripts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenRouter API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <Alert>
            <AlertDescription>
              Your API key is stored locally in your browser and never sent to our servers.
              Get your key from{" "}
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                OpenRouter
              </a>
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isValidating || !apiKey.trim()}
          >
            {isValidating ? "Validating..." : "Save API Key"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
