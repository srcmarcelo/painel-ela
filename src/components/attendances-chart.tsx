'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useClasses } from '@/modules/classes/api';
import { useEffect, useState } from 'react';
import { useData } from '@/lib/data/context';
import { translate } from '@/lib/translate';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const chartConfig = {
  attendanceAmount: {
    label: 'Chamadas Realizadas',
    color: '#2D88D7',
  },
} satisfies ChartConfig;

type chartDataType = { classroomName: string; attendanceAmount: number };

export function AttendanceChart() {
  const { fetchAttendances } = useClasses();
  const { classes } = useData();
  const [attendances, setAttendances] = useState<chartDataType[]>([]);

  const fetchData = async () => {
    const { data } = await fetchAttendances();
    if (data && classes) {
      const chartData = classes.map((classroom) => {
        return {
          classroomName: `${classroom.grade} - ${
            translate.period[classroom.period][0]
          }`,
          attendanceAmount: data.filter(
            (item) => item.class_id === classroom.id
          ).length,
        };
      });

      setAttendances(chartData);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classes]);

  return (
    <Card className='min-h-[700px] w-full'>
      <CardHeader>
        <CardTitle className='text-base sm:text-xl'>Monitoramento de chamadas</CardTitle>
        <CardDescription>Desde 01/08/2024</CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <ChartContainer config={chartConfig} className='min-h-[700px] w-full'>
          <BarChart layout='vertical' accessibilityLayer data={attendances}>
            <CartesianGrid horizontal={false} />
            <XAxis
              type='number'
              tickMargin={10}
              dataKey='attendanceAmount'
              hide
            />
            <YAxis
              dataKey='classroomName'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={100}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              layout='vertical'
              dataKey='attendanceAmount'
              fill='var(--color-attendanceAmount)'
              radius={4}
            >
              <LabelList
                dataKey='attendanceAmount'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
