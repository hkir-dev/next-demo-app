import QuizClientPage from '@/app/quiz/[flow]/client-page'
import { getQuizSuite } from '@/services/getQuizData'

export async function generateStaticParams() {
  return [{ flow: 'linear' }, { flow: 'rounds' }]
}

export default async function QuizPage() {
  const quizSuite = await getQuizSuite()

  return <QuizClientPage quizSuite={quizSuite} />
}
