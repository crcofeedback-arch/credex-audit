import { NextResponse } from 'next/server'
import { audits } from '../../save-audit/route'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const audit = audits.get(params.id)
  
  if (!audit) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(audit)
}