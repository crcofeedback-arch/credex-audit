export type ToolName =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolEntry {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  tool: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export interface AuditResult {
  id?: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary?: string;
  createdAt?: string;
}