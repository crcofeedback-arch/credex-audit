const fs = require('fs');

fs.writeFileSync('src/lib/pricingData.ts', `
export const PRICING: Record<string, Record<string, number>> = {
  cursor: { hobby: 0, pro: 20, business: 40 },
  github_copilot: { individual: 10, business: 19, enterprise: 39 },
  claude: { free: 0, pro: 20, max: 100, team: 30 },
  chatgpt: { plus: 20, team: 30 },
  anthropic_api: { usage_based: 0 },
  openai_api: { usage_based: 0 },
  gemini: { pro: 19.99, api: 0 },
  windsurf: { free: 0, pro: 15 },
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
  cursor: { hobby: "Hobby (Free)", pro: "Pro ($20/user)", business: "Business ($40/user)" },
  github_copilot: { individual: "Individual ($10/user)", business: "Business ($19/user)", enterprise: "Enterprise ($39/user)" },
  claude: { free: "Free", pro: "Pro ($20/user)", max: "Max ($100/user)", team: "Team ($30/user)" },
  chatgpt: { plus: "Plus ($20/user)", team: "Team ($30/user)" },
  anthropic_api: { usage_based: "API Direct (Usage-based)" },
  openai_api: { usage_based: "API Direct (Usage-based)" },
  gemini: { pro: "Pro ($19.99/user)", api: "API Direct (Usage-based)" },
  windsurf: { free: "Free", pro: "Pro ($15/user)" },
};
`);
console.log('pricingData.ts written!');

fs.writeFileSync('src/lib/auditEngine.ts', `
import { AuditInput, AuditResult, ToolRecommendation } from "@/types";
import { PRICING } from "./pricingData";

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: ToolRecommendation[] = [];
  for (const entry of input.tools) {
    const { tool, plan, monthlySpend, seats } = entry;
    let savings = 0;
    let recommendedAction = "";
    let reason = "";
    const toolPricing = PRICING[tool] || {};
    const expectedPricePerSeat = toolPricing[plan] ?? 0;
    const expectedTotal = expectedPricePerSeat * seats;
    switch (tool) {
      case "cursor":
        if (plan === "business" && seats <= 2) {
          savings = (PRICING.cursor.business - PRICING.cursor.pro) * seats;
          recommendedAction = "Downgrade to Cursor Pro";
          reason = "With " + seats + " users, Pro saves $" + savings + "/mo with no feature loss.";
        } else if (plan === "pro" && input.useCase === "writing") {
          savings = PRICING.cursor.pro * seats;
          recommendedAction = "Switch to Claude Pro instead";
          reason = "Cursor is for coding. For writing, Claude Pro at $20/user offers better value.";
        } else {
          recommendedAction = "No change needed";
          reason = "You are on the right plan for your team size and use case.";
        }
        break;
      case "github_copilot":
        if (plan === "enterprise" && seats <= 5) {
          savings = (PRICING.github_copilot.enterprise - PRICING.github_copilot.business) * seats;
          recommendedAction = "Downgrade to GitHub Copilot Business";
          reason = "Enterprise is overkill for " + seats + " users. Business saves $" + savings + "/mo.";
        } else if (plan === "business" && seats <= 3) {
          savings = (PRICING.github_copilot.business - PRICING.github_copilot.individual) * seats;
          recommendedAction = "Switch to Individual plan";
          reason = "For " + seats + " developers, Individual is sufficient and saves $" + savings + "/mo.";
        } else {
          recommendedAction = "No change needed";
          reason = "Plan fits your team size well.";
        }
        break;
      case "claude":
        if (plan === "max") {
          savings = (PRICING.claude.max - PRICING.claude.pro) * seats;
          recommendedAction = "Evaluate downgrade to Claude Pro";
          reason = "Max is $100/user. Pro at $20/user saves $" + savings + "/mo unless you hit limits daily.";
        } else if (plan === "team" && seats <= 2) {
          savings = (PRICING.claude.team - PRICING.claude.pro) * seats;
          recommendedAction = "Switch to individual Pro plans";
          reason = "Team plan adds little for " + seats + " users. Individual Pro saves $" + savings + "/mo.";
        } else {
          recommendedAction = "No change needed";
          reason = "Claude plan looks right for your usage.";
        }
        break;
      case "chatgpt":
        if (plan === "team" && seats <= 2) {
          savings = (PRICING.chatgpt.team - PRICING.chatgpt.plus) * seats;
          recommendedAction = "Switch to ChatGPT Plus";
          reason = "Team overhead not justified for " + seats + " users. Plus saves $" + savings + "/mo.";
        } else {
          recommendedAction = "No change needed";
          reason = "Spend looks appropriate for your use case.";
        }
        break;
      case "gemini":
        if (plan === "pro" && input.useCase === "coding") {
          recommendedAction = "Switch to Cursor or GitHub Copilot";
          reason = "Gemini Pro is general purpose. Cursor is purpose-built for coding.";
        } else {
          recommendedAction = "No change needed";
          reason = "Gemini is a good fit for your use case.";
        }
        break;
      default:
        recommendedAction = "No change needed";
        reason = "Usage looks appropriate.";
    }
    if (monthlySpend > expectedTotal && expectedTotal > 0 && monthlySpend - expectedTotal > 5) {
      const overpay = monthlySpend - expectedTotal;
      savings = Math.max(savings, overpay);
      recommendedAction = "Review your billing";
      reason = "You pay $" + monthlySpend + "/mo but " + plan + " for " + seats + " seats should cost $" + expectedTotal + "/mo.";
    }
    recommendations.push({ tool, currentSpend: monthlySpend, recommendedAction, savings, reason });
  }
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.savings, 0);
  return { input, recommendations, totalMonthlySavings, totalAnnualSavings: totalMonthlySavings * 12 };
}
`);
console.log('auditEngine.ts written!');

fs.writeFileSync('src/components/AuditResults.tsx', `
"use client";

import { AuditResult, ToolRecommendation } from "@/types";
import { TOOL_LABELS } from "@/lib/pricingData";

interface Props {
  result: AuditResult;
  onReset: () => void;
}

export default function AuditResults({ result, onReset }: Props) {
  const { recommendations, totalMonthlySavings, totalAnnualSavings, summary } = result;
  const isHighSavings = totalMonthlySavings > 500;
  const isLowSavings = totalMonthlySavings < 100;

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 rounded-2xl p-8 text-white text-center">
        <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide mb-2">
          Potential Savings Found
        </p>
        <p className="text-5xl font-bold mb-1">
          \${totalMonthlySavings.toFixed(0)}
          <span className="text-2xl font-normal">/mo</span>
        </p>
        <p className="text-emerald-200 text-lg">
          \${totalAnnualSavings.toFixed(0)} saved per year
        </p>
      </div>

      {summary && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            AI Analysis
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Breakdown by Tool</h2>
        {recommendations.map((rec: ToolRecommendation, index: number) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{TOOL_LABELS[rec.tool] || rec.tool}</h3>
                <p className="text-sm text-gray-500">Current spend: \${rec.currentSpend}/mo</p>
              </div>
              {rec.savings > 0 ? (
                <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                  Save \${rec.savings}/mo
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-500 text-sm px-3 py-1 rounded-full">Optimal</span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">{rec.recommendedAction}</p>
            <p className="text-sm text-gray-500">{rec.reason}</p>
          </div>
        ))}
      </div>

      {isHighSavings && (
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">Save even more with Credex</h3>
          <p className="text-gray-300 text-sm mb-4">
            Credex sells discounted AI credits at significant savings off retail.
          </p>
          
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Book a Credex Consultation
          </a>
        </div>
      )}

      {isLowSavings && (
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-1">You are spending well</h3>
          <p className="text-blue-700 text-sm">Your current AI tool stack looks optimized.</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full border border-gray-200 rounded-2xl py-4 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
      >
        Start a New Audit
      </button>
    </div>
  );
}
`);
console.log('AuditResults.tsx written!');
console.log('All files written successfully!');