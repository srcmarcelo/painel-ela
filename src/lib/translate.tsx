interface TranslateColumns {
  [key: string]: string;
}

export const translate: {
  columns: TranslateColumns;
  status: TranslateColumns;
} = {
  status: {
    enabled: 'Ativo',
    disabled: 'Inativo',
  },
  columns: {
    code: 'Código',
    name: 'Nome',
    email: 'Email',
    phone: 'Telefone',
    class_name: 'Turma',
    date_of_birth: 'Data de nascimento',
    responsible_name: 'Responsável',
    mother_name: 'Mãe',
    father_name: 'Pai',
  },
};
