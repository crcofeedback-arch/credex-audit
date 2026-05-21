import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { auditResult } = await req.json();
  const { recommendations, totalMonthlySavings, input } = auditResult;

  const toolList = recommendations
    .map((r: any) => `${r.tool}: $${r.currentSpend}/mo`)
    .join(", ");

  const prompt = `You are a financial advisor specializing in AI tool costs for startups.

A team of ${input.teamSize} people uses these AI tools: ${toolList}.
Their primary use case is ${input.useCase}.
Total potential monthly savings identified: $${totalMonthlySavings}.

Write a 100-word personalized audit summary. Be specific, honest, and actionable.
If savings are low, acknowledge they are spending well. Do not be salesy.
Start directly with the insight, no greetings or preamble.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const summary = data.content?.[0]?.text || getFallbackSummary(auditResult);
    return NextResponse.json({ summary });
  } catch (err) {
    return NextResponse.json({ summary: getFallbackSummary(auditResult) });
  }
}

function getFallbackSummary(auditResult: any): string {
  const { totalMonthlySavings, totalAnnualSavings, input } = auditResult;

  if (totalMonthlySavings > 500) {
    return `Your team of ${input.teamSize} has significant AI spend optimizations available. By adjusting plans and switching where appropriate, you could save $${totalMonthlySavings}/month — that is $${totalAnnualSavings}/year back in your budget.`;
  }

  if (totalMonthlySavings < 100) {
    return `Your team of ${input.teamSize} is spending efficiently on AI tools. Your current stack looks well-matched to your ${input.useCase} use case.`;
  }

  return `Your team of ${input.teamSize} has some meaningful optimizations available. Switching plans where flagged could save $${totalMonthlySavings}/month ($${totalAnnualSavings}/year).`;
}