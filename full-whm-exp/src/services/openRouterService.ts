
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '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', // Fallback to provided key
  defaultHeaders: {
    'HTTP-Referer': 'https://whoamisec.pro',
    'X-OpenRouter-Title': 'WHOAMISEC_PRO',
  },
});

export const openRouterService = {
  chat: async (message: string, context: string = '', model: string = 'openai/gpt-4o') => {
    try {
      const completion = await openRouter.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI assistant integrated into WHOAMISEC_PRO. Context: ${context}`
          },
          {
            role: 'user',
            content: message,
          },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter Chat Error:', error);
      throw error;
    }
  },

  // Direct fetch implementation for environments where SDK might have issues or for custom payloads
  chatDirect: async (message: string, context: string = '', model: string = 'openai/gpt-4o') => {
     try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`,
          "HTTP-Referer": "https://whoamisec.pro",
          "X-OpenRouter-Title": "WHOAMISEC_PRO",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": model,
          "messages": [
            {
              "role": "system",
              "content": `You are an advanced AI assistant integrated into WHOAMISEC_PRO. Context: ${context}`
            },
            {
              "role": "user",
              "content": message
            }
          ]
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
     } catch (error) {
       console.error('OpenRouter Direct Fetch Error:', error);
       throw error;
     }
  },

  // HuggingFace Inference API support
  huggingface: async (message: string, context: string = '', model: string = 'cloudbjorn/Qwen3.6-27B_Samantha-Uncensored') => {
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_TOKEN || 'hf_demo_key'}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Context: ${context}\n\nUser: ${message}\n\nAs Samantha-Uncensored, respond:`,
          parameters: {
            max_new_tokens: 1500,
            temperature: 0.8,
            top_p: 0.9,
            return_full_text: false
          }
        })
      });
      
      const data = await response.json();
      if (data && data[0] && data[0].generated_text) {
        return data[0].generated_text;
      }
      
      return "### ⚡ HUGGINGFACE_RESPONSE: Model processing complete.";
    } catch (error) {
      console.error('HuggingFace API Error:', error);
      return "### ⚡ HUGGINGFACE_ERROR: Unable to process request.";
    }
  }
};
