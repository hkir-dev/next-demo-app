import axios from 'axios'
import { normalizePayload } from '@/services/apiToQuiz'

const ENDPOINT =
  'https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json'

export async function getQuizSuite() {
  const response = await axios.get(ENDPOINT)
  return normalizePayload(response.data)
}
