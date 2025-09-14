import type { Question, Round, QuizSuite, Activity } from '@/domain/model'

/* eslint-disable */
type AnyRec = Record<string, any>
/* eslint-enable */

function toQuestion(raw: AnyRec, fallbackId: string, activityName: string, round?: number): Question {
  const id = (raw.id ?? fallbackId) + ''
  const text = raw.stimulus ?? 'Untitled question'

  const isCorrect = Boolean(raw.is_correct ?? false)
  const order = Number.isInteger(raw.order) ? raw.order : 9999

  const choices = [
    { id: `${id}-correct`, label: 'CORRECT', isCorrect: isCorrect },
    { id: `${id}-incorrect`, label: 'INCORRECT', isCorrect: !isCorrect },
  ]

  return { id, text, round, choices, isCorrect: isCorrect, category: activityName, order: order}
}
export function normalizePayload(payload: AnyRec): QuizSuite {
  if (Array.isArray(payload?.activities)) {
    const activities: Activity[] = payload.activities.map((activity: AnyRec, activityIndex: number) => {
      const questions: Question[] = []
      const rounds: Round[] = []
      let flowKind: string = 'linear'

      if (Array.isArray(activity?.questions)) {
        activity.questions.forEach((q: AnyRec, questionIndex: number) => {
          if (Array.isArray(q?.questions)) {
            // Handle nested questions (e.g., rounds)
            const roundQuestions: Question[] = []
            const roundQuestionIds: string[] = []

            q.questions.forEach((nestedQ: AnyRec, nestedIndex: number) => {
              const nestedId = `a${activityIndex + 1}r${questionIndex + 1}q${nestedIndex + 1}`
              const question = toQuestion(nestedQ, nestedId, activity.activity_name, questionIndex + 1)
              roundQuestions.push(question)
              roundQuestionIds.push(nestedId)
            })

            questions.push(...roundQuestions)
            rounds.push({
              id: `Round ${questionIndex + 1}`,
              title: q.round_title ?? `Round ${questionIndex + 1}`,
              questionIds: roundQuestionIds,
            })
            flowKind = 'rounds'
          } else {
            // Handle flat questions
            const questionId = `a${activityIndex + 1}q${questionIndex + 1}`
            questions.push(toQuestion(q, questionId, activity.activity_name))
          }
        })
      }

      return {
        quizData: { questions, rounds: rounds.length > 0 ? rounds : undefined },
        name: activity.activity_name ?? `Activity ${activityIndex + 1}`,
        order: activity.order ?? activityIndex + 1,
        flowKind: flowKind as 'linear' | 'rounds',
      }
    })

    return { activities }
  }

  return { activities: [] }
}
