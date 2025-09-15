export type Choice = { id: string; label: string; isCorrect: boolean }
export type Question = {
  id: string
  text: string
  round?: number
  category?: string
  userAnswer?: string
  choices: Choice[]
  isCorrect: boolean
  order: number
}

export type FlowKind = 'linear' | 'rounds'
export type Round = { id: string; title?: string; questionIds: string[] }

export interface QuizData {
  questions: Question[]
  rounds?: Round[]
}

export interface Activity {
  quizData: QuizData
  name: string
  order: number
  flowKind: FlowKind
}

export interface QuizSuite {
  activities: Activity[]
}
