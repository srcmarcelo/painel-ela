import Loader from "@/components/loader";

export default function Home() {
  return (
    <main className='flex flex-col items-center w-screen min-h-screen justify-center p-12 px-24 overflow-hidden max-md:px-6'>
      <Loader />
    </main>
  );
}
