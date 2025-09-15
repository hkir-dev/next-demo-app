"use client";

import React from 'react';
import { QuizSuite, Question, Round } from './model';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { RoundCard } from '@/components/round';
import { QuestionCard } from '@/components/question';

export interface FlowStrategy {
    handleAnswer(params: {
        currentQuestionIndex: number;
        quizData: { questions: Question[]; rounds?: Round[] };
        results: { questionId: string; order: number; correct: boolean; round?: number }[];
        setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
        router: ReturnType<typeof useRouter>;
        quizSuite: QuizSuite;
    }): void;

    handleRoundDisplay(params: {
        currentRound: Round | undefined;
        setShowRound: Dispatch<SetStateAction<boolean>>;
    }): void;

    renderRoundCard(params: {
        activityName: string;
        currentRound: Round;
    }): React.ReactElement;

    renderQuestionCard(params: {
        question: Question;
        currentRound: Round | undefined;
        onAnswer: (isCorrect: boolean) => void;
        totalQuestions: number;
        currentQuestionIndex: number;
    }): React.ReactElement;
}

export class LinearFlowStrategy implements FlowStrategy {
    handleAnswer({
        currentQuestionIndex,
        quizData,
        results,
        setCurrentQuestionIndex,
        router,
        quizSuite,
    }: {
        currentQuestionIndex: number;
        quizData: { questions: Question[]; rounds?: Round[] };
        results: { questionId: string; order: number; correct: boolean; round?: number }[];
        setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
        router: ReturnType<typeof useRouter>;
        quizSuite: QuizSuite;
    }): void {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1);
        } else {
            const activity = quizSuite.activities.find((a) => a.flowKind === 'linear');
            sessionStorage.setItem('quizResults', JSON.stringify({ activity: activity?.name, results }));
            router.push(`/score`);
        }
    }

    handleRoundDisplay({ currentRound, setShowRound }: { currentRound: Round | undefined; setShowRound: Dispatch<SetStateAction<boolean>> }): void {
        // No round display logic for linear flow
    }

    renderRoundCard(): React.ReactElement {
        throw new Error('Linear flow does not use RoundCard');
    }

    renderQuestionCard({
        question,
        currentRound,
        onAnswer
    }: {
        question: Question;
        currentRound: Round | undefined;
        onAnswer: (isCorrect: boolean) => void;
    }): React.ReactElement {
        return React.createElement(QuestionCard, {
            question,
            currentRound,
            onAnswer
        });
    }
}

export class RoundsFlowStrategy implements FlowStrategy {
    handleAnswer({
        currentQuestionIndex,
        quizData,
        results,
        setCurrentQuestionIndex,
        router,
        quizSuite,
    }: {
        currentQuestionIndex: number;
        quizData: { questions: Question[]; rounds?: Round[] };
        results: { questionId: string; order: number; correct: boolean; round?: number }[];
        setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
        router: ReturnType<typeof useRouter>;
        quizSuite: QuizSuite;
    }): void {
        const currentQuestion = quizData.questions[currentQuestionIndex];

        const currentRound = quizData.rounds?.find((round) =>
            round.questionIds.includes(currentQuestion.id)
        );

        if (currentQuestionIndex >= quizData.questions.length - 1) {
            const activity = quizSuite.activities.find((a) => a.flowKind === 'rounds');
            sessionStorage.setItem('quizResults', JSON.stringify({ activity: activity?.name, results }));
            router.push(`/score`);
            return;
        }

        if (currentRound || currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1);
        }
    }

    handleRoundDisplay({ currentRound, setShowRound }: { currentRound: Round | undefined; setShowRound: Dispatch<SetStateAction<boolean>> }): void {
        if (currentRound) {
            setShowRound(true);
            setTimeout(() => {
                setShowRound(false);
            }, 1000);
        }
    }

    renderRoundCard({ activityName, currentRound }: {
        activityName: string;
        currentRound: Round;
    }): React.ReactElement {
        return React.createElement(RoundCard, {
            activityName,
            currentRound: { ...currentRound, title: currentRound?.title || 'Untitled Round' }
        });
    }

    renderQuestionCard({
        question,
        currentRound,
        onAnswer
    }: {
        question: Question;
        currentRound: Round | undefined;
        onAnswer: (isCorrect: boolean) => void;
    }): React.ReactElement {
        return React.createElement(QuestionCard, {
            question,
            currentRound,
            onAnswer
        });
    }
}
