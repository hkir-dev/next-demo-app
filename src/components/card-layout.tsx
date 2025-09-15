import React from "react";

type CardLayoutProps = {
    header: React.ReactNode;
    title: React.ReactNode;
    children: React.ReactNode;
};

export const CardLayout = ({ header, title, children }: CardLayoutProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-blue-50">
            <div className="bg-white rounded-xl p-8 md:p-12 text-left shadow-lg max-w-2xl w-full transition-all duration-300 ease-in-out">
                {/* Header Section */}
                <div className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-4">
                    {header}
                </div>

                {/* Title Section */}
                <div className="text-blue-500 text-3xl font-bold mb-4">
                    {title}
                </div>

                {/* Content Section */}
                {children}
            </div>
        </div>
    );
};
