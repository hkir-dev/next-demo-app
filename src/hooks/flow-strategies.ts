import type { QuizData, FlowKind } from '@/domain/model'

export type QuizState = {
  index: number
  answers: Record<string, string>
  roundIndex?: number
}

export interface FlowStrategy {
  getCurrentQuestionId(data: QuizData, state: QuizState): string | null
  goNext(data: QuizData, state: QuizState): QuizState
  isOver(data: QuizData, state: QuizState): boolean
  needsNextRoundPrompt?(data: QuizData, state: QuizState): boolean
  goNextRound?(data: QuizData, state: QuizState): QuizState
  getNextRoundLabel?(data: QuizData, state: QuizState): string | null
}

export const linearFlow: FlowStrategy = {
  getCurrentQuestionId(data, state) {
    return data.questions[state.index]?.id ?? null
  },
  goNext(data, state) {
    const nextIndex = Math.min(state.index + 1, data.questions.length)
    return { ...state, index: nextIndex }
  },
  isOver(data, state) {
    return state.index >= data.questions.length
  },
}

export const roundsFlow: FlowStrategy = {
  getCurrentQuestionId(data, state) {
    const rIdx = state.roundIndex ?? 0
    const round = data.rounds?.[rIdx]
    if (!round) return null
    const qid = round.questionIds[state.index]
    return qid ?? null
  },
  goNext(data, state) {
    const rIdx = state.roundIndex ?? 0
    const round = data.rounds?.[rIdx]
    if (!round) return state
    if (state.index + 1 < round.questionIds.length) {
      return { ...state, index: state.index + 1 }
    }
    // stop at end-of-round so UI can prompt
    return state
  },
  isOver(data, state) {
    const rounds = data.rounds ?? []
    const rIdx = state.roundIndex ?? 0
    if (!rounds.length) return true
    const isLastRound = rIdx >= rounds.length - 1
    const atEndOfLastRound = isLastRound && state.index >= rounds[rIdx].questionIds.length
    return atEndOfLastRound
  },
  needsNextRoundPrompt(data, state) {
    const rounds = data.rounds ?? []
    const rIdx = state.roundIndex ?? 0
    const round = rounds[rIdx]
    if (!round) return false
    const atEndOfRound = state.index >= round.questionIds.length
    const hasNextRound = rIdx + 1 < rounds.length
    return atEndOfRound && hasNextRound
  },
  goNextRound(data, state) {
    const rounds = data.rounds ?? []
    const nextIdx = (state.roundIndex ?? 0) + 1
    if (nextIdx < rounds.length) {
      return { index: 0, answers: state.answers, roundIndex: nextIdx }
    }
    const last = rounds[rounds.length - 1]
    return { ...state, index: last ? last.questionIds.length : 0, roundIndex: rounds.length - 1 }
  },
  getNextRoundLabel(data, state) {
    const rounds = data.rounds ?? []
    const nextIdx = (state.roundIndex ?? 0) + 1
    const next = rounds[nextIdx]
    return next ? (next.title || next.id || `Round ${nextIdx + 1}`) : null
  },
}

export function getStrategy(kind: FlowKind): FlowStrategy {
  return kind === 'rounds' ? roundsFlow : linearFlow
}
