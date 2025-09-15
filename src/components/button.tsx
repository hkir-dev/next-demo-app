import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  onClick: () => void
}

export const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className={`
                flex-1 p-4 rounded-lg font-bold uppercase tracking-wider text-sm
                text-blue-500
                transition-colors duration-300
                cursor-pointer
            `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
