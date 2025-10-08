'use client'

import { useState } from 'react'

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleSeed = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/seed', {
        method: 'POST'
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Seed Database</h1>
          
          <button
            onClick={handleSeed}
            disabled={isLoading}
            className="btn-primary w-full mb-4"
          >
            {isLoading ? 'Seeding...' : 'Seed Database'}
          </button>

          {result && (
            <div className="bg-slate-700 p-4 rounded-lg">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          <div className="mt-6 text-center">
            <a href="/admin" className="text-blue-400 hover:text-blue-300">
              Go to Login →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleSeed = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/seed', {
        method: 'POST'
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Seed Database</h1>
          
          <button
            onClick={handleSeed}
            disabled={isLoading}
            className="btn-primary w-full mb-4"
          >
            {isLoading ? 'Seeding...' : 'Seed Database'}
          </button>

          {result && (
            <div className="bg-slate-700 p-4 rounded-lg">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          <div className="mt-6 text-center">
            <a href="/admin" className="text-blue-400 hover:text-blue-300">
              Go to Login →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

