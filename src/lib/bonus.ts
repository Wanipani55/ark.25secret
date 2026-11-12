// ────────────────────────────────────────────────────────────
//  賞与計算ロジック (賃金規程 第５章・別紙１ 準拠)
// ────────────────────────────────────────────────────────────

export type Grade =
  | 'I'
  | 'II-1' | 'II-2' | 'II-3'
  | 'III-1' | 'III-2'
  | 'IV'
  | 'V'

export type EvaluationRank = 'A' | 'B1' | 'B2' | 'C1' | 'C2' | 'C3' | 'D1' | 'D2' | 'E'

/** 指数テーブル（別紙１） */
const INDEX_TABLE: Record<Grade, { variable: Record<EvaluationRank, number>; flat: number }> = {
  'I':    { flat: 1.0, variable: { A:1.600, B1:1.450, B2:1.300, C1:1.150, C2:1.000, C3:0.850, D1:0.700, D2:0.550, E:0.000 } },
  'II-1': { flat: 1.1, variable: { A:1.920, B1:1.740, B2:1.560, C1:1.380, C2:1.200, C3:1.020, D1:0.840, D2:0.660, E:0.000 } },
  'II-2': { flat: 1.2, variable: { A:2.400, B1:2.175, B2:1.950, C1:1.725, C2:1.500, C3:1.275, D1:1.050, D2:0.825, E:0.000 } },
  'II-3': { flat: 1.3, variable: { A:2.880, B1:2.610, B2:2.340, C1:2.070, C2:1.800, C3:1.530, D1:1.260, D2:0.990, E:0.000 } },
  'III-1':{ flat: 1.6, variable: { A:4.800, B1:4.350, B2:3.900, C1:3.450, C2:3.000, C3:2.550, D1:2.100, D2:1.650, E:0.000 } },
  'III-2':{ flat: 1.8, variable: { A:5.600, B1:5.075, B2:4.550, C1:4.025, C2:3.500, C3:2.975, D1:2.450, D2:1.925, E:0.000 } },
  'IV':   { flat: 2.3, variable: { A:7.200, B1:6.525, B2:5.850, C1:5.175, C2:4.500, C3:3.825, D1:3.150, D2:2.475, E:0.000 } },
  'V':    { flat: 2.5, variable: { A:8.800, B1:7.975, B2:7.150, C1:6.325, C2:5.500, C3:4.675, D1:3.850, D2:3.025, E:0.000 } },
}

/** 規程 第25条4項：基準単価 250,000円 */
const BASE_UNIT_PRICE = 250_000

export interface BonusInput {
  grade: Grade
  /** 上期（夏季）評価ランク */
  rankH1: EvaluationRank
  /** 下期（冬季）評価ランク */
  rankH2: EvaluationRank
  /** 夏季賞与係数（会社から通知される係数。例: 25 → 250,000円÷基準単価で内部計算） */
  coefficientH1: number
  /** 冬季賞与係数 */
  coefficientH2: number
}

export interface BonusResult {
  /** 6月支給（上期暫定） */
  june: {
    flat: number
    variable: number
    total: number
    unitPrice: number
  }
  /** 12月支給（下期暫定） */
  december: {
    flat: number
    variable: number
    total: number
    unitPrice: number
  }
  /** 2月支給（本賞与精算差額） */
  february: {
    flatH1: number
    variableH1: number
    flatH2: number
    variableH2: number
    annualBonus: number
    adjustment: number
  }
  /** 年間合計 */
  annualTotal: number
}

/**
 * 暫定賞与の計算（別紙１ (2)）
 *
 * coefficient: 社内で通知される賞与係数（例: 25, 30 など）
 * 指数単価 = coefficient / BASE_UNIT_PRICE（25万円）で倍率を算出。
 * 係数が基準単価を超えるとき（倍率 > 1.0）:
 *   一律単価=基準単価、変動単価=指数単価（規程 別紙１ (2)③ただし書き適用）
 * 係数が基準単価以下のとき（倍率 ≤ 1.0）:
 *   一律単価=変動単価=指数単価
 */
function calcProvisionalBonus(
  grade: Grade,
  _rank: EvaluationRank,
  coefficient: number,
): { flat: number; variable: number; total: number; unitPrice: number } {
  const idx = INDEX_TABLE[grade]
  const unitPrice = coefficient                         // 指数単価 = 係数そのもの（円）
  const multiplier = coefficient / BASE_UNIT_PRICE     // 基準単価との比率

  let flatUnitPrice: number
  let varUnitPrice: number

  if (multiplier > 1.0) {
    // 指数単価 > 基準単価 → 一律単価=基準単価、変動単価=指数単価（ただし書き）
    flatUnitPrice = BASE_UNIT_PRICE
    varUnitPrice  = unitPrice
  } else {
    // 指数単価 ≦ 基準単価 → 一律単価=変動単価=指数単価
    flatUnitPrice = unitPrice
    varUnitPrice  = unitPrice
  }

  // 暫定賞与の変動指数は D1 を使用（別紙１ (2)④）
  // 暫定は評価不明のためD1固定とし、本賞与で実評価を反映する（規程通り）
  const flatBonus           = flatUnitPrice * idx.flat
  const varBonusProvisional = varUnitPrice  * idx.variable['D1']

  return {
    flat:      Math.round(flatBonus),
    variable:  Math.round(varBonusProvisional),
    total:     Math.round(flatBonus + varBonusProvisional),
    unitPrice: Math.round(unitPrice),
  }
}

/**
 * 本賞与の計算（別紙１ (3)）
 * 一人計算モードのため「全社員の指数合計」は不要。
 * 上期・下期それぞれの係数から一律単価・変動単価を決定し、
 * 実評価ランクの変動指数を適用する。
 */
function calcMainBonus(
  grade: Grade,
  rankH1: EvaluationRank,
  rankH2: EvaluationRank,
  coefficientH1: number,
  coefficientH2: number,
): {
  flatH1: number; variableH1: number
  flatH2: number; variableH2: number
  annualBonus: number
} {
  const idx = INDEX_TABLE[grade]

  const calc = (rank: EvaluationRank, coefficient: number) => {
    const unitPrice  = coefficient                        // 指数単価 = 係数（円）
    const ratio      = coefficient / BASE_UNIT_PRICE      // 基準単価との比率
    const flatUnitPrice = ratio > 1.0 ? BASE_UNIT_PRICE : unitPrice
    const varUnitPrice  = unitPrice
    const flat     = Math.round(flatUnitPrice * idx.flat)
    const variable = Math.round(varUnitPrice  * idx.variable[rank])
    return { flat, variable }
  }

  const h1 = calc(rankH1, coefficientH1)
  const h2 = calc(rankH2, coefficientH2)

  return {
    flatH1:     h1.flat,
    variableH1: h1.variable,
    flatH2:     h2.flat,
    variableH2: h2.variable,
    annualBonus: h1.flat + h1.variable + h2.flat + h2.variable,
  }
}

/**
 * メイン計算関数
 */
export function calculateBonus(input: BonusInput): BonusResult {
  const { grade, rankH1, rankH2, coefficientH1, coefficientH2 } = input

  const june     = calcProvisionalBonus(grade, rankH1, coefficientH1)
  const december = calcProvisionalBonus(grade, rankH2, coefficientH2)
  const main     = calcMainBonus(grade, rankH1, rankH2, coefficientH1, coefficientH2)

  // 2月支給 = 本賞与 - 6月暫定 - 12月暫定（別紙１ (3)⑥）
  const adjustment = main.annualBonus - june.total - december.total

  return {
    june,
    december,
    february: {
      flatH1:     main.flatH1,
      variableH1: main.variableH1,
      flatH2:     main.flatH2,
      variableH2: main.variableH2,
      annualBonus: main.annualBonus,
      adjustment,
    },
    annualTotal: main.annualBonus,
  }
}

export const GRADES: Grade[] = ['I', 'II-1', 'II-2', 'II-3', 'III-1', 'III-2', 'IV', 'V']
export const EVAL_RANKS: EvaluationRank[] = ['A', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'D2', 'E']

export function formatJPY(n: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(n)
}

export function getIndexInfo(grade: Grade, rank: EvaluationRank) {
  const idx = INDEX_TABLE[grade]
  return {
    flat:     idx.flat,
    variable: idx.variable[rank],
    d1:       idx.variable['D1'],
  }
}
