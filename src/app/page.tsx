import Actions from '@/modules/panel/components/actions';
import Cards from '@/modules/panel/components/cards';

export default function Home() {
  return (
    <main className='flex flex-col items-center w-screen justify-center p-12 px-24 overflow-hidden max-md:px-6'>
      <h1 className='mb-12 text-2xl'>Painel de controle</h1>
      <Cards classname='mb-12' />
      <Actions />
    </main>
  );
}
