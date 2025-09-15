'use client';

import { useState, useCallback, useEffect } from 'react';
import { QuizSuite } from '@/domain/model';
import { QuestionCard } from '@/components/question';
import { useParams, useRouter } from 'next/navigation';
import { getQuizData } from '@/hooks/useQuiz'
import type { FlowKind } from '@/domain/model'
import { RoundCard } from '@/components/round';

interface QuizClientPageProps {
    quizSuite: QuizSuite;
}

const QuizClientPage = ({ quizSuite }: QuizClientPageProps) => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState<{ questionId: string; order: number; correct: boolean; round: number | undefined }[]>([]);
    const [showRound, setShowRound] = useState(false);

    const params = useParams<{ flow: FlowKind }>()
    const flow = (params.flow === 'rounds' ? 'rounds' : 'linear') as FlowKind
    const quizData = getQuizData(quizSuite, flow)

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

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const currentRound = quizData.rounds?.find(round => round.questionIds.includes(currentQuestion.id));

    useEffect(() => {
        if (currentRound) {
            setShowRound(true);
            const timer = setTimeout(() => {
                setShowRound(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [currentRound]);

    const activity = quizSuite.activities.find(a => a.flowKind === flow);

    if (showRound && currentRound) {
        return <RoundCard activityName={activity?.name || 'Unknown Activity'} currentRound={{ ...currentRound, title: currentRound.title || 'Untitled Round' }} onAnswer={handleAnswer} />;
    }

    return (
        <QuestionCard 
            question={currentQuestion} 
            currentRound={currentRound} 
            onAnswer={handleAnswer} 
            totalQuestions={quizData.questions.length} 
            currentQuestionIndex={currentQuestionIndex} 
        />
    );
};

export default QuizClientPage;
