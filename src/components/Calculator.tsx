import { useState, useCallback } from 'react'
import {
  calculateBonus,
  type Grade,
  type EvaluationRank,
  type BonusResult,
} from '../lib/bonus'
import { GradeSelect, RankSelect, MultiplierInput } from './FormInputs'
import ResultPanel from './ResultPanel'

export default function Calculator() {
  const [grade, setGrade] = useState<Grade>('II-1')
  const [rankH1, setRankH1] = useState<EvaluationRank>('C2')
  const [rankH2, setRankH2] = useState<EvaluationRank>('C2')
  const [multH1, setMultH1] = useState('1.00')
  const [multH2, setMultH2] = useState('1.00')
  const [result, setResult] = useState<BonusResult | null>(null)

  const handleCalculate = useCallback(() => {
    const m1 = parseFloat(multH1)
    const m2 = parseFloat(multH2)
    if (isNaN(m1) || isNaN(m2) || m1 <= 0 || m2 <= 0) return
    setResult(calculateBonus({
      grade, rankH1, rankH2,
      multiplierH1: m1,
      multiplierH2: m2,
    }))
  }, [grade, rankH1, rankH2, multH1, multH2])

  const isValid = !isNaN(parseFloat(multH1)) && !isNaN(parseFloat(multH2))
    && parseFloat(multH1) > 0 && parseFloat(multH2) > 0

  return (
    <div className="min-h-screen bg-carbon-950">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#78a9ff 1px, transparent 1px), linear-gradient(90deg, #78a9ff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-blue-60 flex items-center justify-center text-white text-xl font-bold select-none flex-shrink-0">
              ¥
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-carbon-50 tracking-tight leading-none">
                賞与計算ツール
              </h1>
              <p className="text-sm text-carbon-500 mt-0.5">賃金規程 第５章・別紙１準拠</p>
            </div>
          </div>
          {/* Top divider */}
          <div className="h-px bg-gradient-to-r from-blue-60 via-carbon-700 to-transparent" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Input form */}
          <div>
            <div className="bg-carbon-900 border border-carbon-700 p-8">
              <h2 className="text-sm font-semibold text-carbon-300 uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-4 h-px bg-blue-60 inline-block"></span>
                入力情報
              </h2>

              <div className="space-y-6">
                {/* Grade */}
                <GradeSelect
                  label="等級・職責"
                  id="grade"
                  value={grade}
                  onChange={v => { setGrade(v); setResult(null) }}
                />

                <SectionDivider label="上期（夏季・6月支給）" color="cyan" />

                {/* H1 rank */}
                <RankSelect
                  label="評価ランク（上期）"
                  id="rankH1"
                  value={rankH1}
                  onChange={v => { setRankH1(v); setResult(null) }}
                />

                {/* H1 multiplier */}
                <MultiplierInput
                  label="夏季賞与係数"
                  id="multH1"
                  value={multH1}
                  onChange={v => { setMultH1(v); setResult(null) }}
                  hint="指数単価 ÷ 基準単価（250,000円）の比率。1.0以下なら一律・変動単価ともに指数単価。"
                />

                <SectionDivider label="下期（冬季・12月支給）" color="green" />

                {/* H2 rank */}
                <RankSelect
                  label="評価ランク（下期）"
                  id="rankH2"
                  value={rankH2}
                  onChange={v => { setRankH2(v); setResult(null) }}
                />

                {/* H2 multiplier */}
                <MultiplierInput
                  label="冬季賞与係数"
                  id="multH2"
                  value={multH2}
                  onChange={v => { setMultH2(v); setResult(null) }}
                  hint="指数単価 ÷ 基準単価（250,000円）の比率。"
                />
              </div>

              {/* Calculate button */}
              <div className="mt-10">
                <button
                  onClick={handleCalculate}
                  disabled={!isValid}
                  className="carbon-btn-primary w-full text-base py-4"
                >
                  賞与を計算する
                </button>
              </div>
            </div>

            {/* Reference table */}
            <div className="mt-4 bg-carbon-900 border border-carbon-700 p-6">
              <h3 className="text-xs font-semibold text-carbon-500 uppercase tracking-widest mb-4">
                評価ランク参考
              </h3>
              <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                {[
                  { rank: 'A',  color: 'text-yellow-30', desc: '最高評価' },
                  { rank: 'B1', color: 'text-cyan-40',   desc: '優秀' },
                  { rank: 'B2', color: 'text-cyan-40',   desc: '期待以上' },
                  { rank: 'C1', color: 'text-carbon-300', desc: '期待通り+' },
                  { rank: 'C2', color: 'text-carbon-300', desc: '期待通り' },
                  { rank: 'C3', color: 'text-carbon-400', desc: '期待通り−' },
                  { rank: 'D1', color: 'text-carbon-500', desc: '要改善+' },
                  { rank: 'D2', color: 'text-carbon-500', desc: '要改善' },
                  { rank: 'E',  color: 'text-carbon-600', desc: '変動賞与0' },
                ].map(({ rank, color, desc }) => (
                  <div key={rank} className="flex items-center gap-1.5 py-1">
                    <span className={`font-medium w-6 ${color}`}>{rank}</span>
                    <span className="text-carbon-600 text-xs">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Result panel */}
          <div className="bg-carbon-900 border border-carbon-700 p-8">
            {result ? (
              <ResultPanel
                result={result}
                grade={grade}
                rankH1={rankH1}
                rankH2={rankH2}
                multiplierH1={parseFloat(multH1)}
                multiplierH2={parseFloat(multH2)}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-carbon-800 text-center">
          <p className="text-xs text-carbon-700">
            © 社内利用限定 — 賞与計算ツール v1.0 — 本ツールの計算結果は参考値です
          </p>
        </footer>
      </div>
    </div>
  )
}

function SectionDivider({ label, color }: { label: string; color: 'cyan' | 'green' }) {
  const lineColor = color === 'cyan' ? 'bg-cyan-40' : 'bg-green-40'
  const textColor = color === 'cyan' ? 'text-cyan-40' : 'text-green-40'
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className={`h-px flex-1 ${lineColor} opacity-30`} />
      <span className={`text-xs font-mono ${textColor} uppercase tracking-widest`}>{label}</span>
      <div className={`h-px flex-1 ${lineColor} opacity-30`} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div className="w-16 h-16 border-2 border-carbon-700 flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="24" height="3" fill="#393939"/>
          <rect x="4" y="14" width="18" height="3" fill="#393939"/>
          <rect x="4" y="20" width="12" height="3" fill="#393939"/>
          <rect x="20" y="17" width="8" height="8" fill="#0f62fe" opacity="0.5"/>
          <text x="24" y="25" textAnchor="middle" fontSize="8" fill="#78a9ff" fontWeight="700">¥</text>
        </svg>
      </div>
      <p className="text-carbon-500 text-sm mb-1">左のフォームに入力して</p>
      <p className="text-carbon-600 text-xs">「賞与を計算する」を押してください</p>
    </div>
  )
}
