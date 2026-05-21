'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface AuditResultsProps {
  results: any[]
  totalSpend: number
  potentialSavings: number
  onReset: () => void
}

export default function AuditResults({ results, totalSpend, potentialSavings, onReset }: AuditResultsProps) {
  const [email, setEmail] = useState('')
  const [captured, setCaptured] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(true)

  // Fetch AI summary
  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ totalSpend, potentialSavings, results })
        })
        const data = await res.json()
        setAiSummary(data.summary)
      } catch (error) {
        setAiSummary(`You could save $${potentialSavings} per month by optimizing your AI tools.`)
      } finally {
        setLoadingSummary(false)
      }
    }
    fetchSummary()
  }, [totalSpend, potentialSavings, results])

  const handleEmailCapture = async () => {
    if (!email) return
    setLoading(true)
    
    const { error } = await supabase
      .from('leads')
      .insert([{ 
        email: email,
        total_spend: totalSpend,
        potential_savings: potentialSavings,
        team_size: 1
      }])
    
    if (!error) {
      setCaptured(true)
    }
    setLoading(false)
  }

  if (!results || results.length === 0) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <p className="text-gray-600">No audit results available.</p>
        <button onClick={onReset} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6">Audit Results</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-sm text-blue-600 font-semibold">Total Monthly Spend</p>
          <p className="text-3xl font-bold text-blue-900">${totalSpend}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-sm text-green-600 font-semibold">Potential Savings</p>
          <p className="text-3xl font-bold text-green-600">${potentialSavings}</p>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-purple-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-purple-800 mb-2">🤖 AI Advisor Summary</h3>
        {loadingSummary ? (
          <p className="text-purple-600">Generating insights...</p>
        ) : (
          <p className="text-purple-700">{aiSummary}</p>
        )}
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tool</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Current</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Recommendation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{result.toolName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{result.currentUsage}</td>
                <td className="px-6 py-4 text-sm text-gray-500">${result.currentCost}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{result.recommendation}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">${result.potentialSavings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Capture Section */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-3">Get Your Full Report</h3>
        <p className="text-gray-600 mb-4">Enter your email to get a detailed PDF report and optimization checklist.</p>
        {!captured ? (
          <div className="flex gap-3">
            <input 
              type="email" 
              placeholder="you@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border rounded-lg p-2"
            />
            <button 
              onClick={handleEmailCapture}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send Report →'}
            </button>
          </div>
        ) : (
          <p className="text-green-600 font-semibold">✓ Thanks! We'll send your report to {email}</p>
        )}
      </div>

      {/* Reset Button */}
      <button onClick={onReset} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
        Analyze Another Setup
      </button>
    </div>
  )
}