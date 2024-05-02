import { ClassesList } from "@/modules/classes/components/classes-list";

export default function Page() {
  return (
    <div className='flex flex-col items-center w-full justify-center overflow-auto p-12 px-24 max-md:px-3 max-md:py-3'>
      <h1 className='text-3xl mb-4'>Turmas</h1>
      <ClassesList />
    </div>
  );
}
