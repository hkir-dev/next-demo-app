'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizData, Question } from '@/lib/model';
import { QuestionCard } from '@/components/question';
import { useRouter } from 'next/navigation';

interface QuizClientPageProps {
    quizData: QuizData;
}

const QuizClientPage = ({ quizData }: QuizClientPageProps) => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [results, setResults] = useState<{ questionId: string; correct: boolean }[]>([]);

    useEffect(() => {
        const shuffledQuestions = [...quizData.questions].sort(() => 0.5 - Math.random());
        setQuestions(shuffledQuestions);
    }, [quizData]);

    const handleAnswer = useCallback((isCorrect: boolean) => {
        const currentQuestion = questions[currentQuestionIndex];
        const newResults = [...results, { questionId: currentQuestion.id, correct: isCorrect }];
        setResults(newResults);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            router.push(`/quiz/score?score=${score + (isCorrect ? 1 : 0)}&results=${JSON.stringify(newResults)}`);
        }
    }, [currentQuestionIndex, questions, results, router, score]);

    if (questions.length === 0) {
        return <div className="flex justify-center items-center h-screen bg-blue-50 text-blue-500">Loading quiz...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const currentRound = quizData.rounds?.find(round => round.questionIds.includes(currentQuestion.id));

    return (
        <QuestionCard question={currentQuestion} currentRound={currentRound} onAnswer={handleAnswer} totalQuestions={questions.length} currentQuestionIndex={currentQuestionIndex} />
    );
};

export default QuizClientPage;
