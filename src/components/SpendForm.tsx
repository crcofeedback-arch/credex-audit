'use client'

import React, { useState, useEffect } from 'react'

interface SpendFormProps {
  onAudit: (data: any) => void
}

type ToolName = 'cursor' | 'copilot' | 'claude' | 'chatgpt' | 'gemini' | 'openaiApi' | 'anthropicApi' | 'windsurf'

export default function SpendForm({ onAudit }: SpendFormProps) {
  const [formData, setFormData] = useState({
    teamSize: 1,
    useCase: 'coding',
    tools: {
      cursor: { plan: 'Pro', seats: 1, spend: 20 },
      copilot: { plan: 'Individual', seats: 1, spend: 10 },
      claude: { plan: 'Pro', seats: 1, spend: 20 },
      chatgpt: { plan: 'Plus', seats: 1, spend: 20 },
      gemini: { plan: 'Pro', seats: 1, spend: 20 },
      openaiApi: { spend: 0 },
      anthropicApi: { spend: 0 },
      windsurf: { plan: 'Pro', seats: 1, spend: 15 }
    }
  })

  useEffect(() => {
    const saved = localStorage.getItem('audit-form-data')
    if (saved) setFormData(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('audit-form-data', JSON.stringify(formData))
  }, [formData])

  const updateTool = (tool: ToolName, field: string, value: any) => {
    setFormData({
      ...formData,
      tools: { ...formData.tools, [tool]: { ...formData.tools[tool], [field]: value } }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAudit(formData)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6">AI Tools Spending</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Team Size</label>
            <input type="number" value={formData.teamSize} onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Primary Use Case</label>
            <select value={formData.useCase} onChange={(e) => setFormData({...formData, useCase: e.target.value})} className="w-full border rounded-lg p-2">
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="data">Data Analysis</option>
              <option value="research">Research</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">Cursor</h3><div className="grid grid-cols-3 gap-3"><select value={formData.tools.cursor.plan} onChange={(e) => updateTool('cursor', 'plan', e.target.value)} className="border rounded p-1"><option>Hobby</option><option>Pro</option><option>Business</option></select><input type="number" placeholder="Seats" value={formData.tools.cursor.seats} onChange={(e) => updateTool('cursor', 'seats', parseInt(e.target.value))} className="border rounded p-1" /><input type="number" placeholder="Monthly $" value={formData.tools.cursor.spend} onChange={(e) => updateTool('cursor', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">GitHub Copilot</h3><div className="grid grid-cols-3 gap-3"><select value={formData.tools.copilot.plan} onChange={(e) => updateTool('copilot', 'plan', e.target.value)} className="border rounded p-1"><option>Individual</option><option>Business</option><option>Enterprise</option></select><input type="number" placeholder="Seats" value={formData.tools.copilot.seats} onChange={(e) => updateTool('copilot', 'seats', parseInt(e.target.value))} className="border rounded p-1" /><input type="number" placeholder="Monthly $" value={formData.tools.copilot.spend} onChange={(e) => updateTool('copilot', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">Claude</h3><div className="grid grid-cols-3 gap-3"><select value={formData.tools.claude.plan} onChange={(e) => updateTool('claude', 'plan', e.target.value)} className="border rounded p-1"><option>Free</option><option>Pro</option><option>Team</option><option>Enterprise</option></select><input type="number" placeholder="Seats" value={formData.tools.claude.seats} onChange={(e) => updateTool('claude', 'seats', parseInt(e.target.value))} className="border rounded p-1" /><input type="number" placeholder="Monthly $" value={formData.tools.claude.spend} onChange={(e) => updateTool('claude', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">ChatGPT</h3><div className="grid grid-cols-3 gap-3"><select value={formData.tools.chatgpt.plan} onChange={(e) => updateTool('chatgpt', 'plan', e.target.value)} className="border rounded p-1"><option>Plus</option><option>Team</option><option>Enterprise</option></select><input type="number" placeholder="Seats" value={formData.tools.chatgpt.seats} onChange={(e) => updateTool('chatgpt', 'seats', parseInt(e.target.value))} className="border rounded p-1" /><input type="number" placeholder="Monthly $" value={formData.tools.chatgpt.spend} onChange={(e) => updateTool('chatgpt', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">Google Gemini</h3><div className="grid grid-cols-3 gap-3"><select value={formData.tools.gemini.plan} onChange={(e) => updateTool('gemini', 'plan', e.target.value)} className="border rounded p-1"><option>Pro</option><option>Ultra</option></select><input type="number" placeholder="Seats" value={formData.tools.gemini.seats} onChange={(e) => updateTool('gemini', 'seats', parseInt(e.target.value))} className="border rounded p-1" /><input type="number" placeholder="Monthly $" value={formData.tools.gemini.spend} onChange={(e) => updateTool('gemini', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">OpenAI API</h3><div className="grid grid-cols-1 gap-3"><input type="number" placeholder="Monthly API spend $" value={formData.tools.openaiApi.spend} onChange={(e) => updateTool('openaiApi', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">Anthropic API</h3><div className="grid grid-cols-1 gap-3"><input type="number" placeholder="Monthly API spend $" value={formData.tools.anthropicApi.spend} onChange={(e) => updateTool('anthropicApi', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <div className="border-t pt-4"><h3 className="font-semibold mb-3">Windsurf</h3><div className="grid grid-cols-3 gap-3"><select value={formData.tools.windsurf.plan} onChange={(e) => updateTool('windsurf', 'plan', e.target.value)} className="border rounded p-1"><option>Pro</option><option>Team</option></select><input type="number" placeholder="Seats" value={formData.tools.windsurf.seats} onChange={(e) => updateTool('windsurf', 'seats', parseInt(e.target.value))} className="border rounded p-1" /><input type="number" placeholder="Monthly $" value={formData.tools.windsurf.spend} onChange={(e) => updateTool('windsurf', 'spend', parseInt(e.target.value))} className="border rounded p-1" /></div></div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">Run Audit →</button>
      </form>
    </div>
  )
}