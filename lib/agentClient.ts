interface AgentResponse {
  intent: string;
  intent_confidence?: number;
  routing: string;
  routing_confidence?: number;
  confidence: number;
  items: Array<{
    sku: string;
    description: string;
    quantity: number;
    category: string;
    confidence?: number;
  }>;
  kb_matches: Array<{
    title: string;
    confidence: number;
    relevance: string;
    section: string;
    row_start?: number;
    row_end?: number;
  }>;
  knowledge_gaps: Array<{
    description: string;
    confidence?: number;
  }> | string[];
  extracted_metadata: Record<string, any>;
}

interface AgentClientConfig {
  mode: 'simulated' | 'live';
  endpoint?: string;
  apiKey?: string;
}

export class AgentClient {
  private config: AgentClientConfig;

  constructor(config: AgentClientConfig) {
    this.config = config;
  }

  async analyzeContent(input: string): Promise<AgentResponse> {
    if (this.config.mode === 'simulated') {
      return this.simulateAnalysis(input);
    } else {
      return this.callLiveAgent(input);
    }
  }

  private async simulateAnalysis(input: string): Promise<AgentResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Import simulated data
    const simulatedData = await import('@/data/simulated-responses.json');
    
    // Simple keyword matching to determine which scenario to use
    const inputLower = input.toLowerCase();
    let selectedScenario;

    if (inputLower.includes('rfp') || inputLower.includes('proposal') || inputLower.includes('enterprise')) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'rfp-enterprise');
    } else if (inputLower.includes('invoice') || inputLower.includes('billing') || inputLower.includes('charged')) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'support-billing');
    } else if (inputLower.includes('api') || inputLower.includes('integration') || inputLower.includes('technical')) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'technical-support');
    } else {
      // Default to first scenario but with generic content
      selectedScenario = simulatedData.scenarios[0];
    }

    if (!selectedScenario) {
      // Fallback generic response
      return {
        intent: "General Inquiry",
        intent_confidence: 0.75,
        routing: "Customer Support > General Team",
        routing_confidence: 0.68,
        confidence: 0.75,
        items: [],
        kb_matches: [
          {
            title: "General FAQ",
            confidence: 0.65,
            relevance: "Medium",
            section: "Common Questions",
            row_start: 1,
            row_end: 15
          }
        ],
        knowledge_gaps: [
          {
            description: "Input content requires manual review",
            confidence: 0.88
          },
          {
            description: "No specific routing rules for this type of inquiry",
            confidence: 0.72
          }
        ],
        extracted_metadata: {
          input_length: input.length,
          detected_type: "general",
          processing_time: new Date().toISOString()
        }
      };
    }

    return selectedScenario.response;
  }

  private async callLiveAgent(input: string): Promise<AgentResponse> {
    if (!this.config.endpoint || !this.config.apiKey) {
      throw new Error('Lyzr endpoint and API key are required for live mode');
    }

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          input: input,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Lyzr API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling Lyzr agent:', error);
      throw new Error('Failed to connect to Lyzr agent. Please check your endpoint and API key.');
    }
  }

  updateConfig(newConfig: Partial<AgentClientConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Singleton instance
let agentClient: AgentClient | null = null;

export function getAgentClient(): AgentClient {
  if (!agentClient) {
    agentClient = new AgentClient({ mode: 'simulated' });
  }
  return agentClient;
}

export type { AgentResponse };