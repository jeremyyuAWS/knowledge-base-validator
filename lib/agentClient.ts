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
    
    // Enhanced keyword matching to determine which scenario to use
    const inputLower = input.toLowerCase();
    let selectedScenario;

    // Manufacturing - Penn Stainless style
    if (this.containsKeywords(inputLower, [
      'stainless steel', 'fabrication', 'manufacturing', 'tanks', 'asme', 
      'pressure vessel', 'welding', 'penn stainless', '316l', 'material test'
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'manufacturing-custom-fabrication');
    }
    // Construction - Tiny's Construction style  
    else if (this.containsKeywords(inputLower, [
      'construction', 'building', 'concrete', 'steel frame', 'commercial', 
      'shopping center', 'expansion', 'hvac', 'electrical', "tiny's construction"
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'construction-project-bid');
    }
    // Energy - Novitium Energy style
    else if (this.containsKeywords(inputLower, [
      'solar', 'energy', 'renewable', 'battery storage', 'grid', 'mw', 
      'photovoltaic', 'power purchase', 'novitium energy', 'transmission'
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'energy-renewable-project');
    }
    // Legal Compliance
    else if (this.containsKeywords(inputLower, [
      'compliance', 'legal', 'regulation', 'ai act', 'gdpr', 'ce marking',
      'conformity assessment', 'data protection', 'globaltech'
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'legal-compliance-inquiry');
    }
    // Emergency Service
    else if (this.containsKeywords(inputLower, [
      'emergency', 'urgent', 'immediate', 'asap', 'water main', 'flooded',
      'transit', 'tunnel', 'metro', 'service disruption'
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'emergency-service-request');
    }
    // Enterprise RFP
    else if (this.containsKeywords(inputLower, [
      'rfp', 'proposal', 'enterprise', 'software solution', 'licensing',
      'project management', 'crm', 'security features'
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'rfp-enterprise');
    }
    // Billing Support
    else if (this.containsKeywords(inputLower, [
      'invoice', 'billing', 'charged', 'account number', 'refund',
      'downgrade', 'basic plan', 'overcharge'
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'support-billing');
    }
    // Technical Support
    else if (this.containsKeywords(inputLower, [
      'api', 'integration', 'technical', '403 forbidden', 'sync',
      'app id', 'users affected', 'stopped working'
    ])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'technical-support');
    }

    if (!selectedScenario) {
      // Enhanced fallback response that tries to extract some meaningful data
      const extractedItems = this.extractGenericItems(input);
      const detectedIntent = this.detectGenericIntent(input);
      
      return {
        intent: detectedIntent,
        intent_confidence: 0.75,
        routing: "Customer Support > General Team",
        routing_confidence: 0.68,
        confidence: 0.75,
        items: extractedItems,
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
            description: "Input content requires manual review for proper classification",
            confidence: 0.88
          },
          {
            description: "No specific routing rules defined for this type of inquiry",
            confidence: 0.72
          }
        ],
        extracted_metadata: {
          input_length: input.length,
          detected_type: "general",
          processing_time: new Date().toISOString(),
          word_count: input.split(/\s+/).length
        }
      };
    }

    return selectedScenario.response;
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private extractGenericItems(input: string): Array<{
    sku: string;
    description: string;
    quantity: number;
    category: string;
    confidence?: number;
  }> {
    const items = [];
    
    // Look for email patterns
    const emailMatch = input.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
      items.push({
        sku: "EMAIL-CONTACT",
        description: emailMatch[1],
        quantity: 1,
        category: "Contact Information",
        confidence: 0.95
      });
    }

    // Look for numbers that might be quantities, costs, or IDs
    const numberMatches = input.match(/\$[\d,]+|\d+\s*(units|pieces|items|employees|users)/gi);
    if (numberMatches) {
      numberMatches.slice(0, 3).forEach((match, index) => {
        items.push({
          sku: `ITEM-${index + 1}`,
          description: match,
          quantity: 1,
          category: "Extracted Value",
          confidence: 0.7
        });
      });
    }

    return items;
  }

  private detectGenericIntent(input: string): string {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('quote') || inputLower.includes('pricing') || inputLower.includes('cost')) {
      return "Pricing Inquiry";
    } else if (inputLower.includes('support') || inputLower.includes('help') || inputLower.includes('issue')) {
      return "Support Request";
    } else if (inputLower.includes('information') || inputLower.includes('details') || inputLower.includes('specifications')) {
      return "Information Request";
    } else if (inputLower.includes('order') || inputLower.includes('purchase') || inputLower.includes('buy')) {
      return "Purchase Intent";
    } else if (inputLower.includes('meeting') || inputLower.includes('consultation') || inputLower.includes('discuss')) {
      return "Consultation Request";
    }
    
    return "General Inquiry";
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