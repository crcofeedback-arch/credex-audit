export const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
  },
  chatgpt: {
    plus: 20,
    team: 30,
  },
  anthropic_api: {
    usage_based: 0,
  },
  openai_api: {
    usage_based: 0,
  },
  gemini: {
    pro: 19.99,
    api: 0,
  },
  windsurf: {
    free: 0,
    pro: 15,
  },
};

export const TOOL_LABELS: Record<string, string> = {
  cursor: "Cursor",
  github_copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API",
  openai_api: "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

export const PLAN_LABELS: Record<string, Record<string, string>> = {
  cursor: {
    hobby: "Hobby (Free)",
    pro: "Pro ($20/user)",
    business: "Business ($40/user)",
  },
  github_copilot: {
    individual: "Individual ($10/user)",
    business: "Business ($19/user)",
    enterprise: "Enterprise ($39/user)",
  },
  claude: {
    free: "Free",
    pro: "Pro ($20/user)",
    max: "Max ($100/user)",
    team: "Team ($30/user)",
  },
  chatgpt: {
    plus: "Plus ($20/user)",
    team: "Team ($30/user)",
  },
  anthropic_api: {
    usage_based: "API Direct (Usage-based)",
  },
  openai_api: {
    usage_based: "API Direct (Usage-based)",
  },
  gemini: {
    pro: "Pro ($19.99/user)",
    api: "API Direct (Usage-based)",
  },
  windsurf: {
    free: "Free",
    pro: "Pro ($15/user)",
  },
};