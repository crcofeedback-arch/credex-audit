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
  const [sharing, setSharing] = useState(false)

  const handleEmailCapture = async () => {
    if (!email) return
    setLoading(true)
    
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([{ 
        email: email,
        total_spend: totalSpend,
        potential_savings: potentialSavings,
        team_size: 1
      }])
    
    if (!supabaseError) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, totalSpend, potentialSavings })
        })
        setCaptured(true)
      } catch (emailError) {
        console.error('Email send failed:', emailError)
        setCaptured(true)
      }
    }
    setLoading(false)
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      const res = await fetch('/api/save-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results, totalSpend, potentialSavings })
      })
      const data = await res.json()
      const url = `${window.location.origin}/audit/${data.id}`
      await navigator.clipboard.writeText(url)
      alert('Share link copied to clipboard!')
    } catch (error) {
      alert('Failed to create share link')
    }
    setSharing(false)
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
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-sm text-blue-600 font-semibold">Total Monthly Spend</p>
          <p className="text-3xl font-bold text-blue-900">${totalSpend}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-sm text-green-600 font-semibold">Potential Savings</p>
          <p className="text-3xl font-bold text-green-600">${potentialSavings}</p>
        </div>
      </div>

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

      <div className="flex gap-4 mt-6">
        <button onClick={onReset} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
          Analyze Another Setup
        </button>
        <button onClick={handleShare} disabled={sharing} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
          {sharing ? 'Creating...' : '🔗 Share Results'}
        </button>
      </div>
    </div>
  )
}