const fs = require('fs');

const content = `import { AuditInput, AuditResult, ToolRecommendation } from "@/types";
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
          reason = "With " + seats + " users, Pro plan saves $" + savings + "/mo with no meaningful feature loss for small teams.";
        } else if (plan === "pro" && input.useCase === "writing") {
          savings = PRICING.cursor.pro * seats;
          recommendedAction = "Switch to Claude Pro instead";
          reason = "Cursor is optimized for coding. For writing workflows, Claude Pro at $20/user offers better value.";
        } else {
          recommendedAction = "No change needed";
          reason = "You are on the right plan for your team size and use case.";
        }
        break;

      case "github_copilot":
        if (plan === "enterprise" && seats <= 5) {
          savings = (PRICING.github_copilot.enterprise - PRICING.github_copilot.business) * seats;
          recommendedAction = "Downgrade to GitHub Copilot Business";
          reason = "Enterprise features are overkill for " + seats + " users. Business plan saves $" + savings + "/mo.";
        } else if (plan === "business" && seats <= 3) {
          savings = (PRICING.github_copilot.business - PRICING.github_copilot.individual) * seats;
          recommendedAction = "Switch to Individual plan";
          reason = "For " + seats + " developers, Individual plan is sufficient and saves $" + savings + "/mo.";
        } else {
          recommendedAction = "No change needed";
          reason = "Plan fits your team size well.";
        }
        break;

      case "claude":
        if (plan === "max") {
          savings = (PRICING.claude.max - PRICING.claude.pro) * seats;
          recommendedAction = "Evaluate downgrade to Claude Pro";
          reason = "Claude Max is $100/user. Unless you hit Pro limits daily, Pro at $20/user saves $" + savings + "/mo per seat.";
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
          reason = "Team plan overhead is not justified for " + seats + " users. Plus saves $" + savings + "/mo total.";
        } else if (plan === "plus" && input.useCase === "coding") {
          recommendedAction = "Consider switching to Cursor or Claude";
          reason = "For coding workflows, Cursor Pro or Claude Pro offer better code-specific capabilities at the same price.";
          savings = 0;
        } else {
          recommendedAction = "No change needed";
          reason = "Spend looks appropriate for your use case.";
        }
        break;

      case "gemini":
        if (plan === "pro" && input.useCase === "coding") {
          recommendedAction = "Switch to Cursor or GitHub Copilot";
          reason = "Gemini Pro is strong for general use but Cursor is purpose-built for coding.";
          savings = 0;
        } else {
          recommendedAction = "No change needed";
          reason = "Gemini is a good fit for your use case.";
        }
        break;

      case "windsurf":
        if (plan === "pro" && seats >= 3) {
          recommendedAction = "Evaluate Cursor Business for team features";
          reason = "At " + seats + " seats, Cursor Business offers better team management.";
          savings = 0;
        } else {
          recommendedAction = "No change needed";
          reason = "Windsurf Pro is good value for your setup.";
        }
        break;

      default:
        recommendedAction = "No change needed";
        reason = "Usage looks appropriate.";
    }

    if (monthlySpend > expectedTotal && expectedTotal > 0) {
      const overpay = monthlySpend - expectedTotal;
      if (overpay > 5) {
        savings = Math.max(savings, overpay);
        recommendedAction = "Review your billing";
        reason = "You are paying $" + monthlySpend + "/mo but the " + plan + " plan for " + seats + " seats should cost $" + expectedTotal + "/mo.";
      }
    }

    recommendations.push({ tool, currentSpend: monthlySpend, recommendedAction, savings, reason });
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.savings, 0);

  return {
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}`;

fs.writeFileSync('src/lib/auditEngine.ts', content);
console.log('Done!');