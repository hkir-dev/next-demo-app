import { Question } from "@/domain/model";
import { ChoiceList } from "@/components/choice";
import React from "react";
import { CardLayout } from "./card-layout";

type QuestionCardProps = {
    question: Question;
    currentRound?: { id: string; title?: string };
    onAnswer: (isCorrect: boolean) => void;
    totalQuestions: number;
    currentQuestionIndex: number;
};

export const QuestionCard = ({ question, currentRound, onAnswer, totalQuestions, currentQuestionIndex }: QuestionCardProps) => {
    const formatText = (text: string) => {
        const parts = text.split(/(\*.*?\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith("*") && part.endsWith("*")) {
                return <strong key={index}>{part.slice(1, -1)}</strong>;
            }
            return part;
        });
    };

    return (
        <CardLayout
            header={`${question.category} ${currentRound ? `/ ${currentRound.title}` : ""}`}
            title={`Q${question.order}.`}
        >
            <hr className="border-[rgb(187,226,252)] border-t-2 w-full m-0" />
            <div className="flex flex-col gap-4">
                <div className="bg-[rgb(253,250,252)] p-4">
                    <p className="text-lg font-normal text-sky-600">{formatText(question.text)}</p>
                </div>
            </div>
            <hr className="border-[rgb(187,226,252)] border-t-2 w-full m-0" />

            <div className="flex flex-col gap-2 mt-4">
                <ChoiceList choices={question.choices} onAnswer={onAnswer} />
            </div>
        </CardLayout>
    );
};