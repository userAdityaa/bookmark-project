'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const Bookmarks = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string>(''); 
  const [profile, setProfile] = useState<string>('');
  const [userGroup, setUserGroup] = useState<string[]>([]);
  const router = useRouter();


  useEffect(() => { 
    // const storedToken = localStorage.getItem('token');
    // if (!storedToken) {
    //   router.push('/login');
    // } else {
    //   setToken(storedToken);
    // }
  }, [router]);

  useEffect(() => {
    const getUser = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:8080/user', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          setUser(response.data.Username); 
          setProfile(response.data.ProfileImage);
          const userID = response.data.ID;
          const groupData = await axios.get(`http://localhost:8080/groups/${userID}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          // console.log(groupData.data[0].group_name);
          setUserGroup(prevGroups => [...prevGroups, groupData.data[0].group_name]);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    getUser();
  }, [token]);

  return (
    <>
      <nav className='flex justify-between items-center h-[2.5rem] mt-[1rem] w-[95vw] mx-auto'>
        <div className='flex items-center'>
          <Image src = '/logo.png' alt='logo' height={0} width={40}></Image>
          <Image src = '/backslash.png' alt='backslash' height={0} width={30}></Image>
          <div className='flex items-center justify-center gap-2'>
            <Image src='/user-3.svg' alt='user-0' height={0} width={20}></Image>
            <p className='text-white'>{userGroup[0]}</p>
            <Image src = '/arrow-key.svg' alt='arrow key' height={0} width={20}></Image>
          </div>
        </div>
        <div className='flex items-center w-[7.5%] justify-center gap-2'>
          <Image src ={`${profile}`} alt='user profile-icon' height={0} width={20}></Image>
          <p className='text-[#f2f0f0b7] font-light text-[15px] mb-[0.2rem]'>{user}</p>
          <Image src = '/arrow-key.svg' alt='arrow key' height={0} width={20}></Image>
        </div>
      </nav>
      <div className='relative'>
        <input 
        className='border border-zinc-700 bg-[#161616] hover:border-zinc-600 absolute h-[3rem] w-[55vw] top-[10vh] left-1/2 transform -translate-x-1/2 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 px-10 text-[#f0e5e57f]' 
        type='text' placeholder='Insert a link, color, or just plain text...'/>
        <Image src = '/plus-icon.svg' alt='plus icon' height={0} width={25} className='absolute top-[11.5vh] left-[23.5vw]'></Image>
      </div>
    </>
  );
};

export default Bookmarks;
