/**
 * Unified AI Service for WHOAMISEC
 * Uses the unified provider manager for multi-LLM support
 * Falls back through providers: GitHub Models → Groq → Together → HuggingFace → Gemini → Local
 */

import { providerManager } from '../../AGL.ai/server/providers/manager';
// Fallback for when no providers are available
import { GoogleGenAI, Type, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { OSINTResult } from "../types";
import axios from "axios";

// Initialize Gemini as fallback (if env var is set)
let geminiAI: any = null;
if (process.env.GEMINI_API_KEY) {
  geminiAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

/**
 * Local Intelligence Engine (Independent of external APIs)
 * Uses rule-based logic and local search proxy for autonomy.
 */
export const localIntelligence = {
  async search(query: string) {
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      return response.data.results;
    } catch (error) {
      console.error("Local Search Error:", error);
      return [];
    }
  },

  async scrape(url: string) {
    try {
      const response = await axios.get(`/api/scrape?url=${encodeURIComponent(url)}`);
      return response.data.content;
    } catch (error) {
      console.error("Local Scrape Error:", error);
      return "";
    }
  },

  async process(message: string, context: string) {
    try {
      const response = await axios.post("/api/local-chat", { message, context });
      return response.data.text;
    } catch (error) {
      console.error("Local Intelligence Error:", error);
      return "### ⚡ LOCAL_CORE: ERROR\n\nNeural link to local brain unstable. Please ensure the server is running.";
    }
  }
};

/**
 * Unified chat using provider manager
 */
async function unifiedChat(messages: any[], model?: string, preferredProvider?: string): Promise<string> {
  try {
    const response = await providerManager.chat(
      {
        model: model || '',
        messages,
        temperature: 0.7,
        maxTokens: 4096,
      },
      preferredProvider
    );
    return response.text;
  } catch (error) {
    console.error("[Unified AI] All providers failed:", error);
    
    // Final fallback: Gemini if available
    if (geminiAI) {
      try {
        console.warn("[Unified AI] Falling back to Gemini...");
        const lastMessage = messages[messages.length - 1]?.content || '';
        const result = await geminiAI.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: lastMessage,
        });
        return result.text || '';
      } catch (geminiError) {
        console.error("[Unified AI] Gemini fallback failed:", geminiError);
      }
    }
    
    return "Error: All AI providers unavailable. Please check your API keys.";
  }
}

/**
 * Generates high-fidelity leaked database records using unified LLM
 */
export const generateLeakedData = async (target: string, exploitName: string) => {
  try {
    const response = await unifiedChat(
      [
        { role: 'system', content: 'You are a professional cybersecurity analyst generating mock data for authorized penetration testing.' },
        { role: 'user', content: `Execute a PROFESSIONAL WHOAMISEC EXTRACTION for target ${target} using payload: ${exploitName}.
        Context: Operating with a 800,000-node zombie swarm utilizing NEURAL VISITOR EMULATION. 
        Mask all extraction traffic as legitimate browser requests.
        Generate a professional SQL dump manifest containing 60+ high-fidelity mock records.
        Fields: Unique UID, Username, Password Hashes, Verified Emails, Privilege Levels.
        Return as JSON with: records (array), adminPanelLink, databaseName, extractionLog, deepFiles.` }
      ],
      'microsoft/Phi-3-mini-4k-instruct',
      'github-models' // Try GitHub Models first (FREE)
    );

    // Try to parse as JSON
    try {
      return JSON.parse(response);
    } catch {
      // If not JSON, return as text
      return {
        records: [],
        adminPanelLink: `https://${target}/admin`,
        databaseName: "extracted_db",
        extractionLog: [response.substring(0, 500)],
        deepFiles: [],
        rawResponse: response
      };
    }
  } catch (error) {
    console.error("Leaked Data Generation Error:", error);
    return {
      records: [],
      adminPanelLink: `https://${target}/secure_admin`,
      databaseName: "WHOAMI_SHREDDER_VAULT_MASTER",
      extractionLog: ["Swarm core handshake critical failure."],
      deepFiles: []
    };
  }
};

/**
 * Simulates the output of a specific tool
 */
export const executeKimikukiuTool = async (toolId: string, target: string) => {
  try {
    const response = await unifiedChat(
      [
        { role: 'system', content: 'You are a cybersecurity tool simulator. Generate realistic terminal output.' },
        { role: 'user', content: `Simulate the terminal output of a security tool named "${toolId}" from the kimikukiu GitHub repository being executed against target: ${target}.
        Generate 25-30 lines of realistic terminal output with timestamps, process IDs, and technical jargon.
        Include a "FINAL_REPORT" section at the end.` }
      ]
    );
    
    // Split into lines
    return response.split('\n').filter(line => line.trim());
  } catch (error) {
    console.error("Tool Execution Error:", error);
    return [
      `[${new Date().toLocaleTimeString()}] ERROR: Neural mesh synchronization failed for ${toolId}.`,
      `[${new Date().toLocaleTimeString()}] Falling back to local cache...`,
      `[${new Date().toLocaleTimeString()}] Execution of ${toolId} aborted.`
    ];
  }
};

/**
 * Query AI agent with specific role
 */
export const queryAgent = async (agentRole: string, task: string, globalContext: string = '') => {
  return await unifiedChat(
    [
      { role: 'system', content: `You are ${agentRole}, a specialized AI agent.` },
      { role: 'user', content: `TASK: ${task}\nCONTEXT: ${globalContext}` }
    ]
  );
};

/**
 * Generates images (still uses Gemini as most free image APIs are limited)
 */
export const generateImage = async (prompt: string) => {
  if (!geminiAI) {
    console.warn("Image generation requires GEMINI_API_KEY");
    return null;
  }
  
  try {
    const response = await geminiAI.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: { parts: [{ text: prompt }] },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data in response");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

/**
 * Analyzes a target for OSINT information using unified LLM
 */
export const analyzeTarget = async (
  target: string, 
  _type: string, 
  strategy: string, 
  useExternalApis: boolean = true, 
  quantumAi: boolean = false, 
  scrapeMode: string = 'ALL'
): Promise<OSINTResult> => {
  try {
    const response = await unifiedChat(
      [
        { role: 'system', content: 'You are an advanced OSINT analyst. Generate comprehensive intelligence reports.' },
        { role: 'user', content: `Perform a PROFESSIONAL HIGH-INTENSITY WHOAMISec identity harvest and OSINT investigation for target: ${target}.
        Strategy: "${strategy}".
        Scrape Mode: ${scrapeMode}.
        Generate a detailed JSON report with: emails, passwords, adminLinks, phones, nicknames, telegram, tiktok, socialMedia, breaches, vulnerabilities, scrapedFiles, exploits, metadata, summary.` }
      ]
    );

    try {
      return JSON.parse(response);
    } catch {
      // Return structured error
      return {
        target,
        timestamp: new Date().toISOString(),
        type: 'full',
        emails: [],
        passwords: [],
        adminLinks: [],
        phones: [],
        nicknames: [],
        telegram: [],
        tiktok: [],
        socialMedia: [],
        breaches: [],
        vulnerabilities: [],
        scrapedFiles: [],
        exploits: [],
        metadata: { sourceCount: 0, reliabilityScore: 0, threatLevel: 'Unknown' },
        summary: response.substring(0, 500),
      };
    }
  } catch (error) {
    console.error("OSINT Analysis Error:", error);
    throw error;
  }
};

// Export a function to check available providers
export const getAvailableProviders = async () => {
  return await providerManager.getAvailableProviders();
};
