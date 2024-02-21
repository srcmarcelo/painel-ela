import React from 'react';

export default function ActionButton({
  content,
  icon,
  onClick,
}: {
  content: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      className='w-full border rounded-xl h-20 flex justify-between items-center px-8 hover:border-primary hover:text-primary'
      onClick={onClick}
    >
      <p>{content}</p>
      {icon}
    </div>
  );
}
