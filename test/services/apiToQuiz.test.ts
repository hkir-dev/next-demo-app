import { normalizePayload } from '@/services/apiToQuiz'
import { QuizSuite } from '@/domain/model'
import * as fs from 'fs'
import * as path from 'path'

describe('normalizePayload', () => {
  it('should correctly normalize the payload into a QuizSuite', () => {
    const filePath = path.resolve(__dirname, '../data/payload.json')
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const payload = JSON.parse(rawData)

    const result: QuizSuite = normalizePayload(payload)

    expect(result).toBeDefined()
    expect(result.activities.length).toBe(2)

    const [activityOne, activityTwo] = result.activities

    // Assertions for Activity One
    expect(activityOne.name).toBe('Activity One')
    expect(activityOne.order).toBe(1)
    expect(activityOne.flowKind).toBe('linear')
    expect(activityOne.quizData.questions.length).toBe(5)
    expect(activityOne.quizData.rounds).toBeUndefined()

    // Assertions for Activity Two
    expect(activityTwo.name).toBe('Activity Two')
    expect(activityTwo.order).toBe(2)
    expect(activityTwo.flowKind).toBe('rounds')
    expect(activityTwo.quizData.questions.length).toBe(4)
    expect(activityTwo.quizData.rounds?.length).toBe(2)

    result.activities.forEach((activity) => {
      expect(activity.name).toBeDefined()
      expect(activity.order).toBeGreaterThan(0)
      expect(activity.flowKind).toBeDefined()
      expect(activity.quizData).toBeDefined()

      const { questions, rounds } = activity.quizData
      expect(questions.length).toBeGreaterThan(0)

      questions.forEach((question) => {
        expect(question.id).toBeDefined()
        expect(question.text).toBeDefined()
      })

      if (rounds) {
        expect(rounds.length).toBeGreaterThan(0)
        rounds.forEach((round) => {
          expect(round.id).toBeDefined()
          expect(round.questionIds.length).toBeGreaterThan(0)
        })
      }
    })
  })
})
