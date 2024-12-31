'use client'
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userIcon, setUserIcon] = useState('/user-0.svg');
  const { register, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        name: username,
        email,
        password,
        icon: userIcon
      });
      
      setEmail('');
      setPassword('');
      setUsername('');
      
      router.push('/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newUsername = e.target.value;
    setUsername(newUsername);
    if(newUsername == '') { 
      setUserIcon('/user-0.svg');
      return
    }
    const value = Math.floor(Math.random() * 6) + 1;
    setUserIcon(`/user-${value}.svg`);
  };

  return (
    <section className="bg-[#161616]">
      <Image src='/logo.png' alt='logo icon' height={0} width={40} className='absolute top-5 left-5' />
      <div className="flex flex-col items-center mt-[8rem] px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-[24px] leading-tight tracking-tight text-gray-400 dark:text-white cursor-pointer">
              Register
              <Link href='/login'><p className='text-[14px] mt-[0.2rem] text-[#a0a0a0]'>Already have an account? <span className='underline'>Login</span></p></Link>
            </h1>
            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400" role="alert">
                {error}
              </div>
            )}
            <div className="border-t-[0.01px] border-[#a0a0a054] w-full mt-[2.5rem]"></div>
            <form className="space-y-0 md:space-y-3 max-sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border border-[#707070] text-zinc-100 rounded-lg block w-full p-2.5 bg-[#161616]"
                  placeholder="john@doe.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='relative'>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="border border-[#707070] text-zinc-100 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-[#161616] pl-10"
                  placeholder="john"
                  required
                  value={username}
                  onChange={handleUsernameChange}
                />
                <Image src={userIcon} alt='username icon' height={0} width={20} className='absolute top-[2.6rem] left-3' />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="border border-[#707070] text-zinc-100 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-[#161616]"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#282828] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}