'use client'
import type { FlowKind, QuizSuite } from '@/domain/model'


export function getQuizData(suiteData: QuizSuite | undefined, kind: FlowKind) {
  if (!suiteData) {
    return { questions: [], activities: [], rounds: undefined }; // Create an empty quizData with undefined rounds
  }
  const activity = suiteData.activities.find(a => a.flowKind === kind)
  return activity ? activity.quizData : { questions: [], activities: [], rounds: undefined }
}
