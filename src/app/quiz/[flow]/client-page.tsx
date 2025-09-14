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
    const [results, setResults] = useState<{ questionId: string; order: number; correct: boolean; round: number | undefined }[]>([]);

    const params = useParams<{ flow: FlowKind }>()
    const flow = (params.flow === 'rounds' ? 'rounds' : 'linear') as FlowKind
    console.log('data:', quizSuite);
    const quizData = getQuizData(quizSuite, flow)
    console.log('quizData:', quizData);

    const handleAnswer = useCallback((isCorrect: boolean) => {
        const currentQuestion = quizData.questions[currentQuestionIndex];
        const newResults = [...results, { questionId: currentQuestion.id, order: currentQuestion.order, correct: isCorrect, round: currentQuestion.round ? currentQuestion.round : undefined }];
        setResults(newResults);

        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            const activity = quizSuite.activities.find(a => a.flowKind === flow);
            sessionStorage.setItem('quizResults', JSON.stringify({ activity: activity?.name, results: newResults }));
            router.push(`/score`);
        }
    }, [currentQuestionIndex, quizData.questions, results, router, flow, quizSuite.activities]);

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
