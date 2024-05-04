'use client';

import { useAuth } from '@/lib/auth/context';
import React from 'react';

const Login: React.FC = () => {
  const { signIn } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = e.target as unknown as any[];
    signIn({ email: data[0].value, password: data[1].value });
  };

  return (
    <div className='flex flex-1 h-screen bg-gray-100'>
      <div className='m-auto p-8 bg-white rounded shadow-md sm:w-96'>
        <div className='flex justify-center items-center w-full'>
          <h2 className='text-3xl text-blue-500 font-semibold font-sans mb-4'>
            Painel ELA
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2' htmlFor='email'>
              Email
            </label>
            <input
              className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              type='text'
              id='email'
              placeholder='exemplo@gmail.com'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-2' htmlFor='password'>
              Senha
            </label>
            <input
              className='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              autoComplete='current-password'
              type='password'
              id='password'
              placeholder='******'
            />
          </div>
          <button
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-100'
            type='submit'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
