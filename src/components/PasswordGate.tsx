import { useState } from 'react'

const STORAGE_KEY = 'bonus_calc_auth'

// ─── パスワードは環境変数から取得。未設定時は開発用デフォルト ───
const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? 'bonus2024'

interface Props {
  onUnlock: () => void
}

export default function PasswordGate({ onUnlock }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      onUnlock()
    } else {
      setError(true)
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-carbon-950 flex items-center justify-center px-4">
      {/* Background grid pattern */}
      <div className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#78a9ff 1px, transparent 1px), linear-gradient(90deg, #78a9ff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className={`relative z-10 w-full max-w-sm ${shaking ? 'animate-shake' : ''}`}>
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-blue-60 flex items-center justify-center text-white text-2xl font-bold select-none">
            ¥
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-carbon-50 tracking-tight mb-1">
            賞与計算ツール
          </h1>
          <p className="text-sm text-carbon-400">アクセスにはパスワードが必要です</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="carbon-label">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={value}
              onChange={e => { setValue(e.target.value); setError(false) }}
              className={`carbon-input ${error ? 'border-red-60 focus:border-red-60 focus:ring-red-60' : ''}`}
              placeholder="パスワードを入力"
            />
            {error && (
              <p className="mt-2 text-xs text-red-40 flex items-center gap-1">
                <span>⚠</span> パスワードが正しくありません
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!value}
            className="carbon-btn-primary w-full"
          >
            ログイン
          </button>
        </form>

        <p className="text-center text-xs text-carbon-600 mt-8">
          賃金規程 第５章・別紙１準拠
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.6s ease-in-out; }
      `}</style>
    </div>
  )
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === '1'
}
