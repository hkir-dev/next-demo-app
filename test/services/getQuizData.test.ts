import { getQuizSuite } from '@/services/getQuizData';
import axios from 'axios';
import { normalizePayload } from '@/services/apiToQuiz';

jest.mock('axios');
jest.mock('@/services/apiToQuiz');

describe('getQuizSuite', () => {
  it('should fetch data from the API and normalize it', async () => {
    const mockData = {
      activities: [
        {
          activity_name: 'Activity One',
          order: 1,
          questions: [
            { id: 'q1', stimulus: 'Question 1', is_correct: true, order: 1 },
          ],
        },
      ],
    };

    const normalizedData = {
      activities: [
        {
          name: 'Activity One',
          order: 1,
          flowKind: 'linear',
          quizData: {
            questions: [
              {
                id: 'q1',
                text: 'Question 1',
                isCorrect: true,
                order: 1,
                choices: [
                  { id: 'q1-correct', label: 'CORRECT', isCorrect: true },
                  { id: 'q1-incorrect', label: 'INCORRECT', isCorrect: false },
                ],
              },
            ],
          },
        },
      ],
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
    (normalizePayload as jest.Mock).mockReturnValue(normalizedData);

    const result = await getQuizSuite();

    expect(axios.get).toHaveBeenCalledWith(
      'https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json'
    );
    expect(normalizePayload).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(normalizedData);
  });

  it('should throw an error if the API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    await expect(getQuizSuite()).rejects.toThrow('API Error');
  });
});
