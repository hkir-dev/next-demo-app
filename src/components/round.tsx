import React from "react";
import { CardLayout } from "./card-layout";

type RoundCardProps = {
    activityName: string;
    currentRound: { id: string; title: string };
};

export const RoundCard = ({ activityName, currentRound }: RoundCardProps) => {
    return (
        <CardLayout
            header={activityName}
            title={currentRound.title}
        >
           <div style={{ minHeight: '100px' }}></div>
        </CardLayout>
    );
};