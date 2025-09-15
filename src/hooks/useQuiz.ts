'use client'
import type { FlowKind, QuizSuite } from '@/domain/model'

export function getQuizData(suiteData: QuizSuite | undefined, kind: FlowKind) {
  if (!suiteData) {
    return { questions: [], activities: [], rounds: undefined }
  }
  const activity = suiteData.activities.find((a) => a.flowKind === kind)
  return activity
    ? activity.quizData
    : { questions: [], activities: [], rounds: undefined }
}
