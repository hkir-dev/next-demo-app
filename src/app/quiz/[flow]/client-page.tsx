'use client';

import { useState, useCallback } from 'react';
import { QuizSuite } from '@/domain/model';
import { QuestionCard } from '@/components/question';
import { useParams, useRouter } from 'next/navigation';
import { getQuizData } from '@/hooks/useQuiz'
import type { FlowKind } from '@/domain/model'

interface QuizClientPageProps {
    quizSuite: QuizSuite;
}

const QuizClientPage = ({ quizSuite }: QuizClientPageProps) => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [results, setResults] = useState<{ questionId: string; correct: boolean }[]>([]);

    const params = useParams<{ flow: FlowKind }>()
    const flow = (params.flow === 'rounds' ? 'rounds' : 'linear') as FlowKind
    // const { data, isLoading, error } = useQuizSuite()
    console.log('data:', quizSuite);
    const quizData = getQuizData(quizSuite, flow)
    console.log('quizData:', quizData);

    const handleAnswer = useCallback((isCorrect: boolean) => {
        const currentQuestion = quizData.questions[currentQuestionIndex];
        const newResults = [...results, { questionId: currentQuestion.id, correct: isCorrect }];
        setResults(newResults);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
        }

        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            router.push(`/score?score=${score + (isCorrect ? 1 : 0)}&results=${JSON.stringify(newResults)}`);
        }
    }, [currentQuestionIndex, quizData.questions, results, router, score]);

    if (quizData.questions.length === 0) {
        return <div className="flex justify-center items-center h-screen bg-blue-50 text-blue-500">Loading quiz...</div>;
    }

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const currentRound = quizData.rounds?.find(round => round.questionIds.includes(currentQuestion.id));

    return (
        <QuestionCard question={currentQuestion} currentRound={currentRound} onAnswer={handleAnswer} totalQuestions={quizData.questions.length} currentQuestionIndex={currentQuestionIndex} />
    );
};

export default QuizClientPage;
