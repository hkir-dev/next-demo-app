import Link from 'next/link';

export default function Home() {

  return (
        <main className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-blue-50">
            <div className="bg-white rounded-xl p-8 md:p-12 text-center shadow-lg max-w-sm w-full transition-all duration-300 ease-in-out">
                <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-2">
                    CAE
                </div>
                <div className="text-blue-500 text-4xl font-bold tracking-widest my-6">
                    Error Find
                </div>
                <div className="flex flex-col gap-4">
                    <Link
                        href="/quiz/linear"
                        className="activity-button border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300 rounded-lg p-4 font-medium uppercase tracking-wider text-sm"
                    >
                        Activity One
                    </Link>
                    <Link
                        href="/quiz/rounds"
                        className="activity-button border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300 rounded-lg p-4 font-medium uppercase tracking-wider text-sm"
                    >
                        Activity Two
                    </Link>
                </div>
            </div>
        </main>
  );
}
