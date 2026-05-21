import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// In-memory storage
const audits = new Map()

export async function POST(request: Request) {
  try {
    const { results, totalSpend, potentialSavings } = await request.json()
    const id = uuidv4()
    
    audits.set(id, {
      results,
      totalSpend,
      potentialSavings,
      createdAt: new Date().toISOString()
    })
    
    return NextResponse.json({ id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 })
  }
}

export { audits }