'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { QuizSuite } from '@/domain/model'
import { useParams, useRouter } from 'next/navigation'
import { getQuizData } from '@/hooks/useQuiz'
import type { FlowKind } from '@/domain/model'
import { LinearFlowStrategy, RoundsFlowStrategy } from '@/domain/flowStrategies'

const QuizClientPage = ({ quizSuite }: { quizSuite: QuizSuite }) => {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [results, setResults] = useState<
    {
      questionId: string
      order: number
      correct: boolean
      round: number | undefined
    }[]
  >([])
  const [showRound, setShowRound] = useState(false)

  const params = useParams<{ flow: FlowKind }>()
  const flow = (params.flow === 'rounds' ? 'rounds' : 'linear') as FlowKind
  const quizData = getQuizData(quizSuite, flow)

  // decide flow strategy based on the flow kind
  const flowStrategy = useMemo(
    () =>
      flow === 'rounds' ? new RoundsFlowStrategy() : new LinearFlowStrategy(),
    [flow],
  )

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const currentQuestion = quizData.questions[currentQuestionIndex]
      const newResults = [
        ...results,
        {
          questionId: currentQuestion.id,
          order: currentQuestion.order,
          correct: isCorrect,
          round: currentQuestion.round ? currentQuestion.round : undefined,
        },
      ]
      setResults(newResults)

      flowStrategy.handleAnswer({
        currentQuestionIndex,
        quizData,
        results: newResults,
        setCurrentQuestionIndex,
        router,
        quizSuite,
      })
    },
    [currentQuestionIndex, quizData, results, router, flowStrategy, quizSuite],
  )

  const currentQuestion = quizData.questions[currentQuestionIndex]
  const currentRound = quizData.rounds?.find((round) =>
    round.questionIds.includes(currentQuestion.id),
  )

  // Handle round display logic if applicable
  useEffect(() => {
    flowStrategy.handleRoundDisplay({
      currentRound,
      setShowRound,
    })
  }, [currentRound, flowStrategy])

  const activity = quizSuite.activities.find((a) => a.flowKind === flow)

  if (showRound && currentRound) {
    return flowStrategy.renderRoundCard({
      activityName: activity?.name || 'Unknown Activity',
      currentRound,
    })
  }

  return flowStrategy.renderQuestionCard({
    question: currentQuestion,
    currentRound,
    onAnswer: handleAnswer,
  })
}

export default QuizClientPage
