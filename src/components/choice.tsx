import { Choice } from "@/lib/model";
import { Button } from "@/components/button";

type ChoiceListProps = {
    choices: Choice[];
    onAnswer: (isCorrect: boolean) => void;
};

export const ChoiceList = ({ choices, onAnswer }: ChoiceListProps) => {
    return (
        <div className="flex gap-4 justify-center">
            {choices.map((choice) => (
                <Button
                    key={choice.id}
                    onClick={() => onAnswer(choice.isCorrect)}
                >
                    {choice.label}
                </Button>
            ))}
        </div>
    );
};
