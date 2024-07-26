interface TranslateColumns {
  [key: string]: string;
}

export const translate: {
  columns: TranslateColumns;
  period: TranslateColumns;
  responsible_types: TranslateColumns;
  status: TranslateColumns;
} = {
  status: {
    enabled: 'Ativo',
    disabled: 'Inativo',
  },
  period: {
    morning: 'Manhã',
    afternoon: 'Tarde',
  },
  responsible_types: {
    mother: 'Mãe',
    father: 'Pai',
    responsible: 'Responsável',
    other: 'Outro',
  },
  columns: {
    code: 'Código',
    name: 'Nome',
    email: 'Email',
    phone: 'Telefone',
    class_id: 'Turma',
    date_of_birth: 'Data de nascimento',
    responsible_id: 'Responsável',
    responsible_type: 'Tipo',
    mother_id: 'Mãe',
    father_id: 'Pai',
  },
};
