import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export async function POST(request: Request) {
  try {
    const { totalSpend, potentialSavings, results } = await request.json()

    const prompt = `You are an AI spending advisor. Write a short, personalized summary (max 150 words) for a user who just audited their AI tool spending.

Facts:
- Total monthly spend: $${totalSpend}
- Potential monthly savings: $${potentialSavings}
- Savings percentage: ${((potentialSavings / totalSpend) * 100).toFixed(1)}%

Write in a helpful, actionable tone. Be honest if savings are low.`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ 
      summary: `Based on your audit, you could save $${potentialSavings} per month by optimizing your AI tools.`
    })
  }
}