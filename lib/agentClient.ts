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
    extraction_source?: string;
  }>;
  kb_matches: Array<{
    title: string;
    confidence: number;
    relevance: string;
    section: string;
    row_start?: number;
    row_end?: number;
    match_reason?: string;
  }>;
  knowledge_gaps: Array<{
    description: string;
    confidence?: number;
    gap_reason?: string;
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

    // Manufacturing - Penn Stainless style (most specific first)
    if (this.containsKeywords(inputLower, ['penn stainless']) || 
        this.containsKeywords(inputLower, ['stainless steel', 'fabrication', 'tanks', 'asme']) ||
        this.containsKeywords(inputLower, ['316l', 'pressure vessel', 'welding'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'manufacturing-custom-fabrication');
    }
    // Construction - Tiny's Construction style  
    else if (this.containsKeywords(inputLower, ["tiny's construction"]) ||
             this.containsKeywords(inputLower, ['construction', 'bidding', 'retail addition']) ||
             this.containsKeywords(inputLower, ['concrete foundation', 'steel frame', 'shopping center'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'construction-project-bid');
    }
    // Energy - Novitium Energy style
    else if (this.containsKeywords(inputLower, ['novitium energy']) ||
             this.containsKeywords(inputLower, ['250 mw', 'solar farm', 'battery energy storage']) ||
             this.containsKeywords(inputLower, ['photovoltaic', 'grid interconnection', '138kv'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'energy-renewable-project');
    }
    // Legal Compliance
    else if (this.containsKeywords(inputLower, ['globaltech']) ||
             this.containsKeywords(inputLower, ['eu ai act', 'compliance', 'chatbot']) ||
             this.containsKeywords(inputLower, ['ce marking', 'dpia', 'conformity assessment'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'legal-compliance-inquiry');
    }
    // Emergency Service
    else if (this.containsKeywords(inputLower, ['metro transit']) ||
             this.containsKeywords(inputLower, ['urgent', 'water main break', 'flooded']) ||
             this.containsKeywords(inputLower, ['union station', 'tunnel', '50,000 gallons'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'emergency-service-request');
    }
    // Billing Support
    else if (this.containsKeywords(inputLower, ['acc-789456']) ||
             this.containsKeywords(inputLower, ['invoice', 'charged $299', 'basic plan']) ||
             this.containsKeywords(inputLower, ['downgraded', 'refund', 'account number'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'support-billing');
    }
    // Technical Support
    else if (this.containsKeywords(inputLower, ['app-2024-x71']) ||
             this.containsKeywords(inputLower, ['api integration', '403 forbidden', '1,200+ users']) ||
             this.containsKeywords(inputLower, ['sync user data', 'stopped working', 'app id'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'technical-support');
    }
    // Enterprise RFP
    else if (this.containsKeywords(inputLower, ['500-employee', 'comprehensive software']) ||
             this.containsKeywords(inputLower, ['project management', 'crm', 'enterprise security']) ||
             this.containsKeywords(inputLower, ['annual licensing', 'api integrations'])) {
      selectedScenario = simulatedData.scenarios.find(s => s.id === 'rfp-enterprise');
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
            row_end: 15,
            match_reason: "No specific knowledge base matches found for this input type"
          }
        ],
        knowledge_gaps: [
          {
            description: "Input content requires manual review for proper classification",
            confidence: 0.88,
            gap_reason: "Content doesn't match any known scenario patterns"
          },
          {
            description: "No specific routing rules defined for this type of inquiry",
            confidence: 0.72,
            gap_reason: "Routing logic needs expansion for this content type"
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
    extraction_source?: string;
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
        confidence: 0.95,
        extraction_source: `Email address found: ${emailMatch[1]}`
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
          confidence: 0.7,
          extraction_source: `Numerical value detected: ${match}`
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