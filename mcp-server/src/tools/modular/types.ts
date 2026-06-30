export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface TeamAgent {
  role: string;
  expertise: string;
}

export interface SpecialistInfo {
  title: string;
  expertise: string;
  description: string;
}

export interface DocumentationConfig {
  specialists: string[];
  guidelines: string;
  structure: string;
}

export interface ConsultationConfig {
  description: string;
  experts: string[];
  framework: string;
}

export interface WaveConfiguration {
  description: string;
  agents: string[];
  deliverables: string[];
}
