import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

interface ToolExecutionRequest {
  toolId: string;
  command: string;
  parameters: Record<string, any>;
}

interface NetworkScanRequest {
  target: string;
  ports?: string;
}

interface VulnScanRequest {
  target: string;
  depth?: number;
}

// Tool execution history
const executionHistory: any[] = [];
const MAX_HISTORY_ITEMS = 100;

// Available tools and their configurations
const AVAILABLE_TOOLS = {
  'credit-card-checker': {
    name: 'Credit Card Checker',
    script: 'credit-card-checker.py',
    category: 'checker',
    description: 'Validate and check credit card numbers'
  },
  'network-scanner': {
    name: 'Network Scanner',
    script: 'network-scanner.py',
    category: 'scanner',
    description: 'Scan network for open ports and services'
  },
  'gmail-checker': {
    name: 'Gmail Checker',
    script: 'gmail-checker.py',
    category: 'checker',
    description: 'Check Gmail account validity'
  },
  'netflix-checker': {
    name: 'Netflix Checker',
    script: 'netflix-checker.py',
    category: 'checker',
    description: 'Check Netflix account validity'
  },
  'paypal-checker': {
    name: 'PayPal Checker',
    script: 'paypal-checker.py',
    category: 'checker',
    description: 'Check PayPal account validity'
  },
  'spotify-checker': {
    name: 'Spotify Checker',
    script: 'spotify-checker.py',
    category: 'checker',
    description: 'Check Spotify account validity'
  },
  'valorant-checker': {
    name: 'Valorant Checker',
    script: 'valorant-checker.py',
    category: 'checker',
    description: 'Check Valorant account validity'
  },
  'wp-bruteforce': {
    name: 'WordPress Bruteforcer',
    script: 'wp-bruteforce.py',
    category: 'bruteforce',
    description: 'Bruteforce WordPress admin credentials'
  },
  'vuln-scanner': {
    name: 'Vulnerability Scanner',
    script: 'vuln-scanner.py',
    category: 'scanner',
    description: 'Scan for common web vulnerabilities'
  },
  'email-extractor-pro': {
    name: 'Email Extractor Pro',
    script: 'email-extractor-pro.py',
    category: 'scanner',
    description: 'Extract emails from websites, files, and text content'
  },
  'jscan-wordpress-scanner': {
    name: 'JScan WordPress Scanner',
    script: 'jscan-wordpress-scanner.py',
    category: 'scanner',
    description: 'Advanced WordPress vulnerability scanner and user enumeration'
  },
  'botnet-c2-controller': {
    name: 'Botnet C2 Controller',
    script: 'botnet-c2-controller.py',
    category: 'exploiter',
    description: 'Advanced botnet command and control interface'
  },
  'email-extractor-pro': {
    name: 'Email Extractor Pro',
    script: 'email-extractor-pro.py',
    category: 'scanner',
    description: 'Extract emails from websites, files, and text content'
  },
  'jscan-wordpress-scanner': {
    name: 'JScan WordPress Scanner',
    script: 'jscan-wordpress-scanner.py',
    category: 'scanner',
    description: 'Advanced WordPress vulnerability scanner and user enumeration'
  },
  'its-ddos-tool': {
    name: 'ITs DDoS Tool',
    script: 'its-ddos-tool.py',
    category: 'exploiter',
    description: 'Advanced DDoS attack tool with multiple methods'
  },
  'sqli-dorks-generator': {
    name: 'SQLi Dorks Generator',
    script: 'sqli-dorks-generator.py',
    category: 'scanner',
    description: 'Generate Google dorks for SQL injection vulnerabilities'
  }
};

/**
 * Execute a Python tool with given parameters
 */
function executePythonTool(scriptName: string, args: string[]): Promise<{ success: boolean; output: string; error?: string; }> {
  return new Promise((resolve) => {
    const toolsDir = path.join(process.cwd(), 'tools');
    const scriptPath = path.join(toolsDir, scriptName);
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      resolve({
        success: false,
        output: '',
        error: `Tool script not found: ${scriptName}`
      });
      return;
    }

    const pythonCmd = 'python'; // Use python command for cross-platform compatibility
    const child = spawn(pythonCmd, [scriptPath, ...args], {
      cwd: toolsDir,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      const success = code === 0;
      resolve({
        success,
        output: output.trim(),
        error: errorOutput.trim() || undefined
      });
    });

    child.on('error', (error) => {
      resolve({
        success: false,
        output: '',
        error: `Failed to execute tool: ${error.message}`
      });
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      child.kill();
      resolve({
        success: false,
        output: output.trim(),
        error: 'Tool execution timed out (60s limit)'
      });
    }, 60000);
  });
}

/**
 * Parse command arguments from parameters
 */
function parseCommandArgs(parameters: Record<string, any>): string[] {
  const args: string[] = [];
  
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined && value !== null) {
      args.push(`--${key}`);
      args.push(String(value));
    }
  }
  
  return args;
}

/**
 * Execute a tool
 */
export async function executeTool(req: Request, res: Response) {
  try {
    const { toolId, command, parameters }: ToolExecutionRequest = req.body;
    
    if (!toolId || !command) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: toolId, command'
      });
    }

    const toolConfig = AVAILABLE_TOOLS[toolId as keyof typeof AVAILABLE_TOOLS];
    if (!toolConfig) {
      return res.status(404).json({
        success: false,
        error: `Tool not found: ${toolId}`
      });
    }

    console.log(`[OffensiveTools] Executing ${toolConfig.name} with parameters:`, parameters);

    // Parse parameters into command arguments
    const args = parseCommandArgs(parameters || {});
    
    // Execute the Python script
    const result = await executePythonTool(toolConfig.script, args);
    
    // Add to execution history
    const historyEntry = {
      id: Date.now().toString(),
      toolId,
      toolName: toolConfig.name,
      parameters,
      success: result.success,
      output: result.output,
      error: result.error,
      timestamp: new Date().toISOString()
    };
    
    executionHistory.unshift(historyEntry);
    if (executionHistory.length > MAX_HISTORY_ITEMS) {
      executionHistory.pop();
    }

    res.json({
      success: result.success,
      output: result.output,
      error: result.error,
      toolId,
      timestamp: historyEntry.timestamp
    });

  } catch (error) {
    console.error('[OffensiveTools] Execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during tool execution'
    });
  }
}

/**
 * Get execution history
 */
export async function getExecutionHistory(req: Request, res: Response) {
  try {
    const { toolId } = req.query;
    
    let history = executionHistory;
    
    // Filter by toolId if provided
    if (toolId) {
      history = executionHistory.filter(entry => entry.toolId === toolId);
    }
    
    res.json({
      success: true,
      history: history.slice(0, 50), // Return last 50 entries
      total: executionHistory.length
    });
    
  } catch (error) {
    console.error('[OffensiveTools] History error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve execution history'
    });
  }
}

/**
 * Get available tools
 */
export async function getAvailableTools(req: Request, res: Response) {
  try {
    const tools = Object.entries(AVAILABLE_TOOLS).map(([id, config]) => ({
      id,
      name: config.name,
      category: config.category,
      description: config.description
    }));
    
    res.json({
      success: true,
      tools
    });
    
  } catch (error) {
    console.error('[OffensiveTools] Tools error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve available tools'
    });
  }
}

/**
 * Network scan endpoint
 */
export async function networkScan(req: Request, res: Response) {
  try {
    const { target, ports }: NetworkScanRequest = req.body;
    
    if (!target) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: target'
      });
    }

    console.log(`[OffensiveTools] Starting network scan on ${target}:${ports || '1-1000'}`);

    const args = [
      '--target', target
    ];
    
    if (ports) {
      args.push('--ports', ports);
    }

    const result = await executePythonTool('network-scanner.py', args);
    
    if (result.success) {
      try {
        const scanData = JSON.parse(result.output);
        res.json({
          success: true,
          result: scanData,
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        res.json({
          success: true,
          output: result.output,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Network scan failed'
      });
    }

  } catch (error) {
    console.error('[OffensiveTools] Network scan error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during network scan'
    });
  }
}

/**
 * Vulnerability scan endpoint
 */
export async function vulnerabilityScan(req: Request, res: Response) {
  try {
    const { target, depth }: VulnScanRequest = req.body;
    
    if (!target) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: target'
      });
    }

    console.log(`[OffensiveTools] Starting vulnerability scan on ${target}`);

    const args = [
      '--target', target
    ];
    
    if (depth) {
      args.push('--depth', String(depth));
    }

    const result = await executePythonTool('vuln-scanner.py', args);
    
    if (result.success) {
      try {
        const scanData = JSON.parse(result.output);
        res.json({
          success: true,
          result: scanData,
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        res.json({
          success: true,
          output: result.output,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Vulnerability scan failed'
      });
    }

  } catch (error) {
    console.error('[OffensiveTools] Vulnerability scan error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during vulnerability scan'
    });
  }
}