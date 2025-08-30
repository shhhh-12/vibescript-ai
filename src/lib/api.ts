// OpenRouter API service for script generation

export interface ScriptGenerationRequest {
  scriptInput: string;
  niche: string;
  audience: string[];
  tone: string;
  language: string;
  length: string;
  format: string;
}

export interface ScriptGenerationResponse {
  script: string;
  shotList: string[];
  bgmSuggestions: string[];
  ctaVariants: string[];
  summary: string;
  estimatedTime: number;
}

const OPENROUTER_MODEL = 'openai/gpt-oss-20b';

export async function generateScript(request: ScriptGenerationRequest): Promise<ScriptGenerationResponse> {
  const OPENROUTER_API_KEY = localStorage.getItem('openrouter_api_key');
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured. Please enter your API key in the setup section.');
  }

  const prompt = buildPrompt(request);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Vibe Script Creator'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert script writer specializing in creating engaging social media content scripts. You always respond with valid JSON containing the script and related metadata.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from API');
    }

    try {
      const parsed = JSON.parse(content);
      return {
        script: parsed.script || '',
        shotList: parsed.shotList || [],
        bgmSuggestions: parsed.bgmSuggestions || [],
        ctaVariants: parsed.ctaVariants || [],
        summary: parsed.summary || '',
        estimatedTime: parsed.estimatedTime || 0
      };
    } catch (parseError) {
      return {
        script: content,
        shotList: generateDefaultShotList(request.format),
        bgmSuggestions: generateDefaultBGM(),
        ctaVariants: generateDefaultCTA(request.language),
        summary: 'AI-generated script based on your input',
        estimatedTime: estimateTime(request.length)
      };
    }
  } catch (error) {
    console.error('Script generation error:', error);
    throw error;
  }
}

function buildPrompt(request: ScriptGenerationRequest): string {
  const { scriptInput, niche, audience, tone, language, length, format } = request;
  
  const audienceText = audience.length > 0 ? audience.join(', ') : 'general audience';
  const lengthDetails = {
    short: '20-40 seconds',
    medium: '40-60 seconds', 
    long: '60-90 seconds'
  };

  return `Create a ${tone.toLowerCase()} social media script for ${format} in ${language} language. 

Target audience: ${audienceText}
Niche: ${niche}
Length: ${lengthDetails[length as keyof typeof lengthDetails]}
Topic/Input: ${scriptInput}

Please respond with a JSON object containing:
{
  "script": "The complete script with timing cues, pauses, and emphasis markers",
  "shotList": ["List of 5-6 shot suggestions for filming"],
  "bgmSuggestions": ["4 different background music suggestions"],
  "ctaVariants": ["4 different call-to-action variations"],
  "summary": "Brief description of the script content and approach",
  "estimatedTime": ${estimateTime(length)}
}

For the script, use these formatting conventions:
- [HOOK] for opening hook
- [EMPH]text[/EMPH] for emphasis
- [pause: Xs] for timing pauses
- [BGM: description] for music cues
- [CAMERA: direction] for camera instructions

Make it engaging, authentic, and optimized for ${format} format.`;
}

function generateDefaultShotList(format: string): string[] {
  return [
    "Opening: Close-up with engaging expression",
    "Problem setup: Medium shot with gestures", 
    "Solution demonstration: Screen recording or demo",
    "B-roll footage for visual interest",
    "Action shots showing results",
    "CTA: Direct to camera close-up"
  ];
}

function generateDefaultBGM(): string[] {
  return [
    "Upbeat motivational track (no copyright)",
    "Trending beat with good energy",
    "Soft background music for storytelling",
    "High-energy track for action sequences"
  ];
}

function generateDefaultCTA(language: string): string[] {
  if (language === 'Tamil') {
    return [
      "Comment pannunga - unga experience share pannunga!",
      "Save pannunga future reference kaga!",
      "Share pannunga friends kaga - help aagum!",
      "Follow pannunga more tips kaga!"
    ];
  } else if (language === 'Thanglish') {
    return [
      "Comment pannunga - your experience share pannunga!",
      "Save pannunga future reference kaga!",
      "Share pannunga friends kaga - help aagum!",
      "Follow pannunga more tips kaga!"
    ];
  } else {
    return [
      "Comment below with your experience!",
      "Save this for future reference!",
      "Share with friends who need this!",
      "Follow for more tips and tricks!"
    ];
  }
}

function estimateTime(length: string): number {
  switch (length) {
    case 'short': return 30;
    case 'medium': return 45;
    case 'long': return 75;
    default: return 45;
  }
}
