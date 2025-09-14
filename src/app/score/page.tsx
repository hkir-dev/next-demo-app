'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const ScorePage = () => {
    const [activityName, setActivityName] = useState('');
    const [results, setResults] = useState<{ questionId: string; order: number; correct: boolean; round: number | undefined }[]>([]);

    useEffect(() => {
        const storedData = sessionStorage.getItem('quizResults');

        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setActivityName(parsedData.activity || '');
                setResults(parsedData.results || []);
            } catch (error) {
                console.error('Failed to parse data from sessionStorage:', error);
            }
        }
    }, []);

    console.log('Score results:', results);

    type Round = { order: number; correct: boolean }[][];
    const rounds = results.reduce<Round>((acc, { round, order, correct }) => {
    if (round === undefined || round === null) {
        if (!acc[0]) {
            acc[0] = [];
        }
        acc[0].push({ order, correct });
    } else {
        if (!acc[round - 1]) {
            acc[round - 1] = [];
        }
        acc[round - 1].push({ order, correct });
    }
    return acc;
    }, []);

    console.log(rounds);

    return (
        <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-blue-50">
            <div className="bg-white rounded-xl p-8 md:p-12 text-center shadow-lg max-w-sm w-full">
                {/* Header Section */}
                <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-4">
                    {activityName}
                </div>
                <div className="text-blue-700 text-3xl font-bold mb-4">
                    Results
                </div>
                <div className="flex flex-col gap-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {rounds?.map((round, index) => (
                        <div key={index}>
                            {rounds.length > 1 && (
                                <div className="bg-blue-100 text-blue-700 font-bold py-2 rounded-lg mb-2">
                                    Round {index + 1}
                                </div>
                            )}
                            {round.map((result, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
                                    <div className="text-lg font-normal text-blue-700">
                                        Q{result.order}
                                    </div>
                                    <div className={`font-bold ${result.correct ? 'text-green-500' : 'text-red-500'}`}>
                                        {result.correct ? 'CORRECT' : 'INCORRECT'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="w-full p-4 text-blue-500 transition-colors cursor-pointer duration-300 rounded-lg font-bold uppercase tracking-wider text-sm"
                    >
                        HOME
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ScorePage;

//                         <div key={round.id}>
//                             <div className="bg-blue-100 text-blue-700 font-medium py-2 rounded-lg mb-2">
//                                 {round.title}
//                             </div>
//                             {round.questionIds.map(questionId => {
//                                 const question = questionsById.get(questionId);
//                                 const result = results.find(r => r.questionId === questionId);
//                                 if (!question || !result) return null;

//                                 return (
//                                     <div key={question.id} className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
//                                         <div className="text-lg font-normal text-gray-700">
//                                             Q{quizData.questions.findIndex(q => q.id === question.id) + 1}
//                                         </div>
//                                         <div className={`font-medium ${result.correct ? 'text-green-500' : 'text-red-500'}`}>
//                                             {result.correct ? 'CORRECT' : 'INCORRECT'}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ))}
//                 </div>
//                 <div className="mt-8">
//                     <Link
//                         href="/"
//                         className="w-full p-4 text-blue-500 transition-colors cursor-pointer duration-300 rounded-lg font-bold uppercase tracking-wider text-sm"
//                     >
//                         HOME
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ScorePage;
