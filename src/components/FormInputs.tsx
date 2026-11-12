import { GRADES, EVAL_RANKS, type Grade, type EvaluationRank } from '../lib/bonus'

interface Props {
  label: string
  id: string
  value: Grade
  onChange: (v: Grade) => void
}
export function GradeSelect({ label, id, value, onChange }: Props) {
  return (
    <div>
      <label htmlFor={id} className="carbon-label">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value as Grade)}
          className="carbon-select pr-10"
        >
          {GRADES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <ChevronDown />
      </div>
    </div>
  )
}

interface RankProps {
  label: string
  id: string
  value: EvaluationRank
  onChange: (v: EvaluationRank) => void
}
export function RankSelect({ label, id, value, onChange }: RankProps) {
  const rankColors: Record<EvaluationRank, string> = {
    A:  'text-yellow-30',
    B1: 'text-cyan-40',
    B2: 'text-cyan-40',
    C1: 'text-carbon-50',
    C2: 'text-carbon-50',
    C3: 'text-carbon-300',
    D1: 'text-carbon-400',
    D2: 'text-carbon-500',
    E:  'text-carbon-600',
  }
  return (
    <div>
      <label htmlFor={id} className="carbon-label">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value as EvaluationRank)}
          className={`carbon-select pr-10 ${rankColors[value]}`}
        >
          {EVAL_RANKS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <ChevronDown />
      </div>
    </div>
  )
}

interface MultiplierProps {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  hint?: string
}
export function MultiplierInput({ label, id, value, onChange, hint }: MultiplierProps) {
  return (
    <div>
      <label htmlFor={id} className="carbon-label">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          step="0.01"
          min="0"
          max="5"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="carbon-input pr-16"
          placeholder="1.00"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon-500 text-xs font-mono pointer-events-none">
          倍率
        </span>
      </div>
      {hint && <p className="mt-1.5 text-xs text-carbon-500">{hint}</p>}
    </div>
  )
}

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-carbon-400">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
      </svg>
    </span>
  )
}
