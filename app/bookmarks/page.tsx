'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface ListItem {
  icon: string; 
  name: string; 
  link: string; 
  createdAt: string;
}

const Bookmarks = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string>(''); 
  const [profile, setProfile] = useState<string>('');
  const [userGroup, setUserGroup] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>(''); 
  const [results, setResults] = useState<ListItem[]>([]); 


  const isValidLink = (input: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
    return urlPattern.test(input.trim());
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const extractDomainName = (url: string): string => {
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  };

  const handleAddResult = async () => {
    if (inputValue.trim()) {
      let newItem: ListItem;
      const isURL = isValidLink(inputValue);
      const createdAt = formatDate(new Date());
  
      if (isURL) {
        const domainName = extractDomainName(inputValue);
        newItem = {
          icon: `https://logo.clearbit.com/${domainName.toLowerCase()}.com`,
          name: domainName,
          link: inputValue.trim(),
          createdAt
        };
      } else {
        newItem = {
          icon: '/text_icon.svg',
          name: inputValue.trim(),
          link: '',
          createdAt,
        };
      }
  
      setResults((prevResults) => [...prevResults, newItem]);
      setInputValue('');
    }
  };


  useEffect(() => {
    const getUser = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:8080/user', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          setUser(response.data.Username); 
          setProfile(response.data.ProfileImage);
          const userID = response.data.ID;
          const groupData = await axios.get(`http://localhost:8080/groups/${userID}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setUserGroup((prevGroups) => [...prevGroups, groupData.data[0].group_name]);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    getUser();
  }, [token]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddResult();
    }
  };

  return (
    <>
      <nav className='flex justify-between items-center h-[2.5rem] mt-[1rem] w-[95vw] mx-auto'>
        <div className='flex items-center'>
          <Image src='/logo.png' alt='logo' height={0} width={40} />
          <Image src='/backslash.png' alt='backslash' height={0} width={30} />
          <div className='flex items-center justify-center gap-2'>
            <Image src='/user-3.svg' alt='user-0' height={0} width={20} />
            <p className='text-white'>{userGroup[0]}</p>
            <Image src='/arrow-key.svg' alt='arrow key' height={0} width={20} />
          </div>
        </div>
        <div className='flex items-center w-[7.5%] justify-center gap-2'>
          <Image src={profile} alt='user profile-icon' height={0} width={20} />
          <p className='text-[#f2f0f0b7] font-light text-[15px] mb-[0.2rem]'>{user}</p>
          <Image src='/arrow-key.svg' alt='arrow key' height={0} width={20} />
        </div>
      </nav>

      <div className='flex items-center py-8 relative flex-col gap-8'>
        <div className="relative w-[55vw]">
          <input 
            className='border border-zinc-700 bg-[#161616] hover:border-zinc-600 h-[3rem] w-full mx-auto rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 px-10 text-[#f0e5e57f] pl-12' 
            type='text' 
            placeholder='Insert a link, color, or just plain text...'
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={handleKeyDown}
          />
          <Image 
            src='/plus-icon.svg' 
            alt='plus icon' 
            height={0} 
            width={25} 
            className='absolute top-1/2 left-4 transform -translate-y-1/2 pointer-events-auto cursor-pointer'
            onClick={handleAddResult}
          />
        </div>

        <div className='flex justify-between items-center border-b border-zinc-700 py-4 w-[55vw] text-[13px] text-[#a0a0a0]'>
          <div className='flex items-center justify-between w-full'>
            <p>Title</p>
            <p>Created At</p>
          </div>
        </div>

        <div className='w-[55vw]'>
          {results.map((result, index) => (
            <div key={index} className='py-2 text-zinc-300 flex items-center gap-2 justify-between'>
              <div className='flex items-center gap-2'>
              <Image src={result.icon} alt='result icon' height={20} width={18}></Image>
              <p>{result.name}</p>
              {result.link != '' && 
              <p className='text-[14px] text-[#a0a0a0]'>{result.link}</p>
              } 
              </div>
              <p className='text-[13px] text-[#a0a0a0]'>{result.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;
