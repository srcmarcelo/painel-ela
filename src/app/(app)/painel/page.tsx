import Actions from '@/modules/panel/components/actions';
import Cards from '@/modules/panel/components/cards';

export default function Home() {
  return (
    <main className='flex flex-col items-center w-full justify-center p-6 px-24 overflow-hidden max-md:px-6'>
      <h1 className="text-4xl font-bold mb-4">Painel de controle</h1>
      <p className="text-sm text-gray-500 mb-8">Dados gerais da escola</p>
      <Cards classname='mb-12' />
      <Actions />
    </main>
  );
}
