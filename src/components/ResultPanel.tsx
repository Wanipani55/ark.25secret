import { type BonusResult, formatJPY, type Grade, type EvaluationRank, getIndexInfo } from '../lib/bonus'

interface Props {
  result: BonusResult
  grade: Grade
  rankH1: EvaluationRank
  rankH2: EvaluationRank
  multiplierH1: number
  multiplierH2: number
}

export default function ResultPanel({ result, grade, rankH1, rankH2, multiplierH1, multiplierH2 }: Props) {
  const { june, december, february, annualTotal } = result
  const idxH1 = getIndexInfo(grade, rankH1)
  const idxH2 = getIndexInfo(grade, rankH2)

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-carbon-50 tracking-tight">計算結果</h2>
        <span className="text-xs text-carbon-500 font-mono bg-carbon-800 px-3 py-1 border border-carbon-700">
          基準単価 ¥250,000
        </span>
      </div>

      {/* 3 payment cards */}
      <div className="grid gap-4">
        {/* 6月 */}
        <div className="result-card result-card-june">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-cyan-40 uppercase tracking-widest">6月支給</span>
                <span className="text-xs text-carbon-500">上期暫定賞与</span>
              </div>
              <p className="text-3xl font-semibold text-carbon-50 font-mono tracking-tight">
                {formatJPY(june.total)}
              </p>
            </div>
            <IndexBadge flat={idxH1.flat} variable={idxH1.d1} label="D1固定" />
          </div>
          <BreakdownRow label="一律賞与" value={june.flat} />
          <BreakdownRow label="変動賞与（D1）" value={june.variable} last />
          <MultiplierNote multiplier={multiplierH1} unitPrice={june.unitPrice} />
        </div>

        {/* 12月 */}
        <div className="result-card result-card-dec">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-green-40 uppercase tracking-widest">12月支給</span>
                <span className="text-xs text-carbon-500">下期暫定賞与</span>
              </div>
              <p className="text-3xl font-semibold text-carbon-50 font-mono tracking-tight">
                {formatJPY(december.total)}
              </p>
            </div>
            <IndexBadge flat={idxH2.flat} variable={idxH2.d1} label="D1固定" />
          </div>
          <BreakdownRow label="一律賞与" value={december.flat} />
          <BreakdownRow label="変動賞与（D1）" value={december.variable} last />
          <MultiplierNote multiplier={multiplierH2} unitPrice={december.unitPrice} />
        </div>

        {/* 2月 */}
        <div className="result-card result-card-feb">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-blue-40 uppercase tracking-widest">翌年2月支給</span>
                <span className="text-xs text-carbon-500">本賞与精算</span>
              </div>
              <p className={`text-3xl font-semibold font-mono tracking-tight ${
                february.adjustment >= 0 ? 'text-carbon-50' : 'text-red-40'
              }`}>
                {formatJPY(february.adjustment)}
              </p>
              {february.adjustment < 0 && (
                <p className="text-xs text-red-40 mt-1">※ マイナスは翌年6月で清算（第26条）</p>
              )}
            </div>
            <div className="text-right">
              <IndexBadge flat={idxH1.flat + idxH2.flat} variable={idxH1.variable + idxH2.variable} label="上下期合算" />
            </div>
          </div>
          <Divider />
          <div className="text-xs text-carbon-500 mb-2 font-mono">本賞与内訳（上期）</div>
          <BreakdownRow label={`一律賞与 上期`} value={february.flatH1} />
          <BreakdownRow label={`変動賞与 上期（${rankH1}）`} value={february.variableH1} last />
          <div className="text-xs text-carbon-500 mb-2 mt-3 font-mono">本賞与内訳（下期）</div>
          <BreakdownRow label={`一律賞与 下期`} value={february.flatH2} />
          <BreakdownRow label={`変動賞与 下期（${rankH2}）`} value={february.variableH2} last />
          <Divider />
          <div className="flex justify-between text-sm">
            <span className="text-carbon-400">本賞与合計</span>
            <span className="font-mono text-carbon-50 font-medium">{formatJPY(february.annualBonus)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-carbon-400">暫定賞与合計（6月+12月）</span>
            <span className="font-mono text-carbon-400">−{formatJPY(june.total + december.total)}</span>
          </div>
        </div>
      </div>

      {/* Annual total */}
      <div className="result-card result-card-total mt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-yellow-30 uppercase tracking-widest">年間賞与合計</span>
              <span className="text-xs text-carbon-500">本賞与ベース</span>
            </div>
            <p className="text-4xl font-semibold text-carbon-50 font-mono tracking-tighter">
              {formatJPY(annualTotal)}
            </p>
          </div>
          <div className="text-right text-xs text-carbon-500 space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 bg-cyan-40 inline-block flex-shrink-0"></span>
              <span>6月 {formatJPY(june.total)}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 bg-green-40 inline-block flex-shrink-0"></span>
              <span>12月 {formatJPY(december.total)}</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 bg-blue-40 inline-block flex-shrink-0"></span>
              <span>2月 {formatJPY(february.adjustment)}</span>
            </div>
          </div>
        </div>

        {/* Monthly equivalent */}
        <div className="mt-4 pt-4 border-t border-carbon-700">
          <div className="flex justify-between text-sm">
            <span className="text-carbon-500">月換算（÷12）</span>
            <span className="font-mono text-carbon-300">{formatJPY(Math.round(annualTotal / 12))}</span>
          </div>
        </div>
      </div>

      {/* Legal note */}
      <p className="text-xs text-carbon-600 pt-2 leading-relaxed">
        ※ 賃金規程 第５章・別紙１に基づく計算。在籍期間満期・欠勤なし前提。
        暫定賞与の変動指数は規程通りD1を使用。実際の支給額は会社決定の原資配分によります。
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  )
}

function BreakdownRow({ label, value, last }: { label: string; value: number; last?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${!last ? 'border-b border-carbon-700/50' : ''}`}>
      <span className="text-xs text-carbon-500">{label}</span>
      <span className="text-xs font-mono text-carbon-300">{formatJPY(value)}</span>
    </div>
  )
}

function IndexBadge({ flat, variable, label }: { flat: number; variable: number; label: string }) {
  return (
    <div className="text-right">
      <div className="text-xs text-carbon-600 mb-1 font-mono">{label}</div>
      <div className="text-xs text-carbon-500 font-mono space-y-0.5">
        <div>一律 <span className="text-carbon-300">{flat.toFixed(1)}</span></div>
        <div>変動 <span className="text-carbon-300">{variable.toFixed(3)}</span></div>
      </div>
    </div>
  )
}

function MultiplierNote({ multiplier, unitPrice }: { multiplier: number; unitPrice: number }) {
  return (
    <div className="mt-3 pt-3 border-t border-carbon-700/50 flex items-center justify-between">
      <span className="text-xs text-carbon-600">賞与係数 → 指数単価</span>
      <span className="text-xs font-mono text-carbon-500">
        {multiplier}万円 → {formatJPY(unitPrice)}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="my-3 border-t border-carbon-700" />
}
