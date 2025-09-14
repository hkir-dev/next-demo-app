'use client';

import { useSearchParams } from 'next/navigation';
import { QuizData, Question } from '@/lib/model';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Mock data to simulate fetching from an API or database
const quizData: QuizData = {
    questions: [
        {
            id: 'q1',
            text: 'I think that starting a school magazine is an excellent idea!',
            choices: [
                { id: 'c1', label: 'CORRECT', isCorrect: true },
                { id: 'c2', label: 'INCORRECT', isCorrect: false },
            ],
            round: 1,
            category: 'ACTIVITY TWO',
        },
        {
            id: 'q2',
            text: 'They always give you a choice of vegetables, but I prefer to eat what I like.',
            choices: [
                { id: 'c3', label: 'CORRECT', isCorrect: false },
                { id: 'c4', label: 'INCORRECT', isCorrect: true },
            ],
            round: 1,
            category: 'ACTIVITY TWO',
        },
        {
            id: 'q3',
            text: 'I would like to know if it is possible to exchange my ticket for another day.',
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

const ScorePage = () => {
    const searchParams = useSearchParams();
    const [score, setScore] = useState(0);
    const [results, setResults] = useState<{ questionId: string; correct: boolean }[]>([]);

    useEffect(() => {
        const scoreParam = searchParams.get('score');
        const resultsParam = searchParams.get('results');

        if (scoreParam) {
            setScore(parseInt(scoreParam, 10));
        }

        if (resultsParam) {
            try {
                setResults(JSON.parse(resultsParam));
            } catch (error) {
                console.error('Failed to parse results from URL:', error);
            }
        }
    }, [searchParams]);

    // Map question IDs to their full question objects for display
    const questionsById = new Map<string, Question>(quizData.questions.map(q => [q.id, q]));

    return (
        <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-blue-50">
            <div className="bg-white rounded-xl p-8 md:p-12 text-center shadow-lg max-w-sm w-full">
                {/* Header Section */}
                <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-4">
                    ACTIVITY TWO
                </div>
                <div className="text-blue-700 text-3xl font-bold mb-4">
                    Results
                </div>
                <div className="flex flex-col gap-4">
                    {quizData.rounds?.map(round => (
                        <div key={round.id}>
                            <div className="bg-blue-100 text-blue-700 font-medium py-2 rounded-lg mb-2">
                                {round.title}
                            </div>
                            {round.questionIds.map(questionId => {
                                const question = questionsById.get(questionId);
                                const result = results.find(r => r.questionId === questionId);
                                if (!question || !result) return null;

                                return (
                                    <div key={question.id} className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
                                        <div className="text-lg font-normal text-gray-700">
                                            Q{quizData.questions.findIndex(q => q.id === question.id) + 1}
                                        </div>
                                        <div className={`font-medium ${result.correct ? 'text-green-500' : 'text-red-500'}`}>
                                            {result.correct ? 'CORRECT' : 'INCORRECT'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="w-full p-4 text-blue-500 transition-colors cursor-pointer duration-300 rounded-lg font-bold uppercase tracking-wider text-sm"
                    >
                        HOME
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ScorePage;
