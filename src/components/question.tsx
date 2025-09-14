import { Question } from "@/domain/model";
import { ChoiceList } from "@/components/choice";
import React from "react";

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
        <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-blue-50">
            <div className="bg-white rounded-xl p-8 md:p-12 text-left shadow-lg max-w-2xl w-full transition-all duration-300 ease-in-out">
                {/* Header Section */}
                <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-4">
                    {question.category} {currentRound && `/ ${currentRound.title}`}
                </div>

                {/* Question Number */}
                <div className="text-blue-500 text-3xl font-bold mb-4">
                    Q{question.order}.
                </div>

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
            </div>
        </div>
    );
};