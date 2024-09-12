interface TranslateColumns {
  [key: string]: string;
}

export const translate: {
  columns: TranslateColumns;
  period: TranslateColumns;
  responsible_types: TranslateColumns;
  user_types: TranslateColumns;
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
  user_types: {
    teacher: 'Professor(a)',
    admin: 'Administrativo',
    developer: 'Desenvolvedor',
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
    created_at: 'Cadastrado em',
    role: 'Função',
    cpf: 'CPF',
  },
};
