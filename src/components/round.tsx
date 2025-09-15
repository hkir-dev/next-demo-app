import React from "react";
import { CardLayout } from "./card-layout";

type RoundCardProps = {
    activityName: string;
    currentRound: { id: string; title: string };
    onAnswer: (isCorrect: boolean) => void;
};

export const RoundCard = ({ activityName, currentRound, onAnswer }: RoundCardProps) => {
    return (
        <CardLayout
            header={activityName}
            title={currentRound.title}
        >
           <div style={{ minHeight: '100px' }}></div>
        </CardLayout>
    );
};