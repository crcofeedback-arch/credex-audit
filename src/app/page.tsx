'use client'

import React, { useState } from 'react'
import SpendForm from '@/components/SpendForm'
import AuditResults from '@/components/AuditResults'
import { runAudit } from '@/lib/auditEngine'

export default function Home() {
  const [results, setResults] = useState<any>(null)

  const handleAudit = (formData: any) => {
    const auditResults = runAudit(formData)
    const totalSpend = auditResults.reduce((sum: number, r: any) => sum + r.currentCost, 0)
    const potentialSavings = auditResults.reduce((sum: number, r: any) => sum + r.potentialSavings, 0)
    
    setResults({
      results: auditResults,
      totalSpend: totalSpend,
      potentialSavings: potentialSavings
    })
  }

  const handleReset = () => {
    setResults(null)
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <AuditResults 
            results={results.results}
            totalSpend={results.totalSpend}
            potentialSavings={results.potentialSavings}
            onReset={handleReset}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Spending Auditor</h1>
          <p className="text-gray-600">Find out if you're overpaying for AI tools</p>
        </div>
        <SpendForm onAudit={handleAudit} />
      </div>
    </div>
  )
}