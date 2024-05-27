import { ClassesList } from '@/modules/classes/components/classes-list';

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full justify-center overflow-auto p-8 sm:p-12">
      <h1 className="text-4xl font-bold mb-4">Turmas</h1>
      <p className="text-sm text-gray-500 mb-8">Clique na turma para gerenciá-la</p>
      <ClassesList />
    </div>
  );
}
