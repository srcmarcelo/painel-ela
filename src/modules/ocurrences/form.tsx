import { MyForm, Option, formFields } from '@/lib/ts-form';
import React from 'react';
import { z } from 'zod';

const OccurrenceSchema = z.object({
  description: formFields.long_text.describe('Descrição'),
  type: formFields.select_option.describe('Tipo'),
  notifyResponsibles: formFields.switch.describe('Notificar responsáveis?').optional(),
});

export function OccurrenceForm({
  onSubmit: _onSubmit,
}: {
  onSubmit: (values: any) => void;
}) {
  const onSubmit = async (values: z.infer<typeof OccurrenceSchema>) => {
    _onSubmit(values);
  };

  const occurrenceTypes: Option[] = [
    { label: 'Positiva', value: 'good' },
    { label: 'Negativa', value: 'bad' },
    { label: 'Neutra', value: 'other' },
  ];

  return (
    <MyForm
      formProps={{ id: 'occurrence_form' }}
      props={{
        type: {
          options: occurrenceTypes,
        } as any,
      }}
      schema={OccurrenceSchema}
      onSubmit={onSubmit}
    >
      {({ type, description, notifyResponsibles }) => {
        return (
          <div className='space-y-4 py-4 w-full mb-4'>
            {type}
            {description}
            {notifyResponsibles}
          </div>
        );
      }}
    </MyForm>
  );
}
