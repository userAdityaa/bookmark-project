'use client'
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '../components';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("https://bkmarks.vercel.app/api/auth/login", 
        { email, password },  
        { headers: { 'Content-Type': 'application/json' } }
      );

      const userId = response.data.user.id;

      const bookmarkResponse = await axios.get(`https://bkmarks.vercel.app/api/bookmarks/user/${userId}`, 
        {headers: {'Content-Type': 'application/json'}}
      );

      const bookmark = bookmarkResponse.data; 
      const bookmarkName = bookmark?.name?.toLowerCase();

      if(bookmarkName) { 
        setIsLoading(true);
        router.push(`/bookmarks/${bookmarkName}`)
      }
      else { 
        alert("Bookmark name not found!");
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials and try again.");
    }
};


  return (
    <section className="bg-[#161616]">
      <Image src='/logo.png' alt='logo icon' height={0} width={40} className='absolute top-5 left-5'></Image>
      {isLoading && <LoadingScreen />}
      <div className="flex flex-col items-center mt-[8rem] px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-[24px] leading-tight tracking-tight text-gray-900 dark:text-white cursor-pointer">
              Login
              <Link href='/register'>
                <p className='text-[14px] mt-[0.2rem] text-[#a0a0a0]'>Don't have an account? <span className='underline'>Register</span></p>
              </Link>
            </h1>
            <div className="border-t-[0.01px] border-[#a0a0a054] w-full mt-[2.5rem]"></div>
            <form className="space-y-0 md:space-y-3" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border border-[#707070] text-zinc-100 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-[#161616]"
                  placeholder="john@doe.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
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
              <div className="flex items-center justify-between">
                {/* Optionally add a "Remember Me" checkbox here */}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#282828] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Login
              </button>
              <p className="text-sm font-light text-[#a0a0a0]">
                Forgot your password?{' '}
                <Link href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500 underline">
                  Well that sucks.
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
