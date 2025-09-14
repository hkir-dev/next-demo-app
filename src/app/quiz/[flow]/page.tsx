import { QuizData } from '@/lib/model';
import QuizClientPage from '@/app/quiz/[flow]/client-page';

// Mock data to simulate fetching from an API or database
const quizData: QuizData = {
    questions: [
        {
            id: 'q1',
            text: 'I think that starting a *school magazine* is an excellent idea!',
            choices: [
                { id: 'c1', label: 'CORRECT', isCorrect: true },
                { id: 'c2', label: 'INCORRECT', isCorrect: false },
            ],
            round: 1,
            category: 'ACTIVITY TWO',
        },
        {
            id: 'q2',
            text: 'They always give you a *choice of vegetables*, but I prefer to eat what I like.',
            choices: [
                { id: 'c3', label: 'CORRECT', isCorrect: false },
                { id: 'c4', label: 'INCORRECT', isCorrect: true },
            ],
            round: 1,
            category: 'ACTIVITY TWO',
        },
        {
            id: 'q3',
            text: 'I would like to know if it is possible to *exchange my ticket* for another day.',
            choices: [
                { id: 'c5', label: 'CORRECT', isCorrect: false },
                { id: 'c6', label: 'INCORRECT', isCorrect: true },
            ],
            round: 2,
            category: 'ACTIVITY TWO',
        },
    ],
    rounds: [{ id: 'r1', title: 'ROUND 1', questionIds: ['q1', 'q2'] }, { id: 'r2', title: 'ROUND 2', questionIds: ['q3'] }],
};

export async function generateStaticParams() {
    return [
        { flow: 'linear' },
        { flow: 'rounds' },
    ];
}

const QuizPage = () => {
    return <QuizClientPage quizData={quizData} />;
};

export default QuizPage;
