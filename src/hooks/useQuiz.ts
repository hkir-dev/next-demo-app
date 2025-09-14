'use client'
import type { FlowKind, Question, QuizSuite } from '@/domain/model'
import { getStrategy, type QuizState } from '@/hooks/flow-strategies'
import { useCallback, useMemo, useState } from 'react'

export function getQuizData(suiteData: QuizSuite | undefined, kind: FlowKind) {
  if (!suiteData) {
    return { questions: [], activities: [], rounds: undefined }; // Create an empty quizData with undefined rounds
  }
  const activity = suiteData.activities.find(a => a.flowKind === kind)
  return activity ? activity.quizData : { questions: [], activities: [], rounds: undefined }
}

export function useQuiz(suiteData: QuizSuite | undefined, kind: FlowKind) {
  const [state, setState] = useState<QuizState>({ index: 0, answers: {}, roundIndex: 0 })
  const strategy = useMemo(() => getStrategy(kind), [kind])

  const data = useMemo(() => {
    if (!suiteData) return undefined;
    for (const activity of suiteData.activities) {
      if (activity.flowKind === kind) {
        return activity.quizData;
      }
    }
    return undefined;
  }, [suiteData, kind]);

  const currentQuestion: Question | null = useMemo(() => {
    if (!data) return null
    const id = strategy.getCurrentQuestionId(data, state)
    return id ? data.questions.find(q => q.id === id) ?? null : null
  }, [data, state, strategy])

  const selectChoice = useCallback((choiceId: string) => {
    if (!currentQuestion) return
    setState((s) => ({ ...s, answers: { ...s.answers, [currentQuestion.id]: choiceId } }))
  }, [currentQuestion])

  const next = useCallback(() => {
    if (!data) return
    setState((s) => strategy.goNext(data, s))
  }, [data, strategy])

  const needsNextRound = useMemo(
    () => (data && strategy.needsNextRoundPrompt ? strategy.needsNextRoundPrompt(data, state) : false),
    [data, state, strategy]
  )

  const takeNextRound = useCallback(() => {
    if (!data || !strategy.goNextRound) return
    setState((s) => strategy.goNextRound!(data, s))
  }, [data, strategy])

  const nextRoundLabel = useMemo(
    () => (data && strategy.getNextRoundLabel ? strategy.getNextRoundLabel(data, state) : null),
    [data, state, strategy]
  )

  const isOver = useMemo(() => (data ? strategy.isOver(data, state) : false), [data, state, strategy])

  const score = useMemo(() => {
    if (!data) return 0
    return Object.entries(state.answers).reduce((acc, [qid, cid]) => {
      const q = data.questions.find(q => q.id === qid)
      const ch = q?.choices.find(c => c.id === cid)
      return acc + (ch?.isCorrect ? 1 : 0)
    }, 0)
  }, [data, state.answers])

  const totalQuestions = data?.questions.length ?? 0

  return {
    currentQuestion,
    selectChoice,
    next,
    isOver,
    score,
    totalQuestions,
    answers: state.answers,
    needsNextRound,
    takeNextRound,
    nextRoundLabel,
  }
}
