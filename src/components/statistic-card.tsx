import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function StatisticCard({
  title,
  content,
  icon,
}: {
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className='w-44'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
