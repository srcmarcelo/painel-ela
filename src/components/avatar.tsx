import { AvatarIcon } from '@radix-ui/react-icons';

export const Avatar = () => {
  return (
    <div className='h-9 w-9 rounded-full bg-primary flex justify-center items-center'>
      <AvatarIcon className='h-7 w-7 text-white' />
    </div>
  );
};
