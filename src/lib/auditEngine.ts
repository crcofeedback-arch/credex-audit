export interface AuditResult {
  toolName: string
  currentUsage: string
  currentCost: number
  recommendation: string
  potentialSavings: number
}

export function runAudit(formData: any): AuditResult[] {
  const results: AuditResult[] = []
  let totalSpend = 0

  // Calculate total spend first
  for (const tool in formData.tools) {
    if (formData.tools[tool].spend) {
      totalSpend += formData.tools[tool].spend
    }
  }

  // Cursor audit
  if (formData.tools.cursor.spend > 0) {
    const cursor = formData.tools.cursor
    let savings = 0
    let recommendation = ''
    
    if (cursor.plan === 'Business' && cursor.seats < 5) {
      savings = cursor.spend - (cursor.seats * 20)
      recommendation = `Switch to Pro plan for teams under 5 people. Save $${savings}/month.`
    } else if (cursor.plan === 'Pro' && formData.useCase !== 'coding' && formData.teamSize === 1) {
      savings = cursor.spend - 0
      recommendation = `Hobby plan is free. Consider downgrading if you're not coding daily.`
    } else {
      recommendation = `Current plan is optimal for your usage.`
    }
    
    results.push({
      toolName: 'Cursor',
      currentUsage: `${cursor.plan} - ${cursor.seats} seat(s)`,
      currentCost: cursor.spend,
      recommendation,
      potentialSavings: Math.max(0, savings)
    })
  }

  // Copilot audit
  if (formData.tools.copilot.spend > 0) {
    const copilot = formData.tools.copilot
    let savings = 0
    let recommendation = ''
    
    if (copilot.plan === 'Business' && copilot.seats < 10) {
      savings = copilot.spend - (copilot.seats * 10)
      recommendation = `Individual plan at $10/user is cheaper for teams under 10. Save $${savings}/month.`
    } else {
      recommendation = `Plan is appropriate for your team size.`
    }
    
    results.push({
      toolName: 'GitHub Copilot',
      currentUsage: `${copilot.plan} - ${copilot.seats} seat(s)`,
      currentCost: copilot.spend,
      recommendation,
      potentialSavings: Math.max(0, savings)
    })
  }

  // Claude audit
  if (formData.tools.claude.spend > 0) {
    const claude = formData.tools.claude
    let savings = 0
    let recommendation = ''
    
    if (claude.plan === 'Team' && claude.seats < 5) {
      savings = claude.spend - (claude.seats * 20)
      recommendation = `Pro plan at $20/user is cheaper for teams under 5. Save $${savings}/month.`
    } else if (claude.plan === 'Pro' && formData.useCase === 'coding') {
      recommendation = `Consider Claude API for coding - pay only for what you use.`
    } else {
      recommendation = `Current plan works for your use case.`
    }
    
    results.push({
      toolName: 'Claude',
      currentUsage: `${claude.plan} - ${claude.seats} seat(s)`,
      currentCost: claude.spend,
      recommendation,
      potentialSavings: Math.max(0, savings)
    })
  }

  // ChatGPT audit
  if (formData.tools.chatgpt.spend > 0) {
    const chatgpt = formData.tools.chatgpt
    let savings = 0
    let recommendation = ''
    
    if (chatgpt.plan === 'Team' && chatgpt.seats < 2) {
      savings = chatgpt.spend - (chatgpt.seats * 20)
      recommendation = `Plus plan at $20/user is better for under 2 users. Save $${savings}/month.`
    } else {
      recommendation = `Plan is suitable for your needs.`
    }
    
    results.push({
      toolName: 'ChatGPT',
      currentUsage: `${chatgpt.plan} - ${chatgpt.seats} seat(s)`,
      currentCost: chatgpt.spend,
      recommendation,
      potentialSavings: Math.max(0, savings)
    })
  }

  // Gemini audit
  if (formData.tools.gemini.spend > 0) {
    const gemini = formData.tools.gemini
    results.push({
      toolName: 'Google Gemini',
      currentUsage: `${gemini.plan} - ${gemini.seats} seat(s)`,
      currentCost: gemini.spend,
      recommendation: `Consider API access if usage is high - pay per token.`,
      potentialSavings: 0
    })
  }

  // API tools
  if (formData.tools.openaiApi.spend > 0) {
    results.push({
      toolName: 'OpenAI API',
      currentUsage: `API access`,
      currentCost: formData.tools.openaiApi.spend,
      recommendation: `For high volume, consider ChatGPT Team at $30/user for predictable billing.`,
      potentialSavings: 0
    })
  }

  if (formData.tools.anthropicApi.spend > 0) {
    results.push({
      toolName: 'Anthropic API',
      currentUsage: `API access`,
      currentCost: formData.tools.anthropicApi.spend,
      recommendation: `Claude Pro at $20/user might be cheaper for moderate usage.`,
      potentialSavings: 0
    })
  }

  if (formData.tools.windsurf.spend > 0) {
    const windsurf = formData.tools.windsurf
    results.push({
      toolName: 'Windsurf',
      currentUsage: `${windsurf.plan} - ${windsurf.seats} seat(s)`,
      currentCost: windsurf.spend,
      recommendation: `Compare with Cursor Pro at $20/user for similar features.`,
      potentialSavings: 0
    })
  }

  return results
}