'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios';
import { LogOut } from 'lucide-react';
import {useRouter} from 'next/navigation';

interface ListItem {
    icon: string; 
    name: string; 
    link: string; 
    createdAt: string;
}

const convertDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

const BookmarkPage = () => {
    const [userName, setUserName] = useState<string>('');
    const [userIcon, setUserIcon] = useState<string>('');
    const [bookmarkList, setBookmarkList] = useState<{ name: string; icon: string }[]>([]);
    const [currentBookmark, setCurrentBookmark] = useState<{ name: string; icon: string } | null>(null);
    const [bookmarkId, setBookmarkId] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>(''); 
    const [results, setResults] = useState<ListItem[]>([]); 
    const [bookmarkOpen, setBookmarkOpen] = useState<boolean>(false);
    const [userNameOpen, setUserNameOpen] = useState<boolean>(false);

    const router = useRouter();

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

    useEffect(() => { 
        const fetchData = async () => {
            try {
                const userResponse = await axios.get("http://localhost:3000/api/user", {
                    headers: {"Content-Type": "application/json"}
                });
                const userData = userResponse.data.user;
                setUserName(userData.name);
                setUserIcon(userData.icon);

                const bookmarkName = window.location.pathname.split('/').pop();
                const bookmarkResponse = await axios.post(
                    `http://localhost:3000/api/bookmarks/user/${userData.id}`, 
                    { bookmarkName },
                    { headers: { "Content-Type": "application/json" } }
                );

                const bookmarkData = {
                    name: bookmarkResponse.data.name,
                    icon: bookmarkResponse.data.icon,
                };

                setBookmarkList([bookmarkData]);
                setCurrentBookmark(bookmarkData);
                setBookmarkId(bookmarkResponse.data.id);

                if (bookmarkResponse.data.listItems?.length > 0) { 
                    setResults(bookmarkResponse.data.listItems);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddResult = async () => {
        if (inputValue.trim()) {
            let newItem: ListItem;
            const isURL = isValidLink(inputValue);
            const createdAt = formatDate(new Date());
        
            if (isURL) {
                const domainName = extractDomainName(inputValue);
                newItem = {
                    icon: `https://logo.clearbit.com/${domainName.toLowerCase()}.com` || '/default_link.svg',
                    name: domainName,
                    link: inputValue.trim(),
                    createdAt,
                };
            } else {
                newItem = {
                    icon: '/text_icon.svg',
                    name: inputValue.trim(),
                    link: '',
                    createdAt,
                };
            }
        
            try { 
                const response = await axios.post(
                    `http://localhost:3000/api/list`, 
                    { newItem, bookmarkId }, 
                    { headers: { "Content-Type": "application/json" } }
                );
                
                if (response.status === 200) {
                    setResults(prevResults => [...prevResults, response.data]);
                } else {
                    console.error('Failed to create list item');
                }
            } catch(error) { 
                console.error('Error adding result:', error);
                alert('Error adding result. Please try again.');
            }
            setInputValue('');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/logout", {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 200) {
                router.push("/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddResult();
        }
    };

    const handleUsernameClick = () => { 
        setUserNameOpen(!userNameOpen)
    }

    const handleBookmarkClick = () => { 
        setBookmarkOpen(!bookmarkOpen);
    }

    return (
        <>
            <nav className='flex justify-between items-center h-[2.5rem] mt-[1rem] w-[95vw] mx-auto'>
                <div className='flex items-center relative'>
                    <Image src='/logo.png' alt='logo' height={0} width={40} />
                    <Image src='/backslash.png' alt='backslash' height={0} width={30} />
                    <div className='flex items-center justify-center gap-2 hover:bg-[#343434] hover:rounded-3xl p-2' onClick={() => handleBookmarkClick()}>
                        {currentBookmark && (
                            <>
                                <Image src={currentBookmark.icon} alt='bookmark-icon' height={0} width={18} />
                                <p className='text-[#a0a0a0] text-[14px]'>{currentBookmark.name}</p>
                            </>
                        )}
                        <Image src='/arrow-key.svg' alt='arrow key' height={0} width={20} />
                    </div>

                    {bookmarkOpen && (
                    <div className="absolute top-full left-20 mt-2 w-48 bg-[#1e1e1e] rounded-lg shadow-lg border border-zinc-700 overflow-hidden">
                    <div className="py-1">
                        {bookmarkList.map((bookmark, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-[#343434] hover:cursor-pointer"
                            onClick={() => {
                            }}
                        >
                            <Image src={bookmark.icon} alt="bookmark icon" height={0} width={18} />
                            <span className="text-[#a0a0a0] text-[14px]">{bookmark.name}</span>
                        </div>
                        ))}
                    </div>
                    
                    <div className="border-t border-zinc-700">
                        <button
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#343434] text-[#a0a0a0] text-[14px]"
                        >
                        <span className="text-xl flex items-center">+</span> New Group
                        </button>
                        <button
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#343434] text-[#a0a0a0] text-[14px]"
                        >
                        <Image src="/delete_icon.svg" alt="delete" height={0} width={14} />
                        Delete Group
                        </button>
                    </div>
                    </div>
                )}
                </div>
                <div className='flex items-center justify-center gap-2 relative hover:bg-[#343434] hover:rounded-3xl p-2' onClick={() => handleUsernameClick()}>
                    <Image src={userIcon} alt='user profile-icon' height={0} width={18} />
                    <p className='text-[#a0a0a0] font-light text-[14px] mb-[0.2rem]'>{userName}</p>
                    <Image src='/arrow-key.svg' alt='arrow key' height={0} width={20} />
                </div>

                {userNameOpen && (
                    <div className="absolute top-12 right-5 mt-2 w-48 bg-[#1e1e1e] rounded-lg shadow-lg border border-zinc-700 overflow-hidden">
                    <div className="z-40"> 
                        <button
                        onClick={() => {
                            handleLogout()
                        }}
                        className="z-50 flex items-center gap-3 w-full px-4 py-2 hover:bg-[#343434] text-[#a0a0a0] hover:cursor-pointer"
                        >
                        <LogOut size={18} />
                        <span className="text-[14px]">Log out</span>
                        </button>
                    </div>
                    </div>
                )}
            </nav>
    
            <div className='flex items-center py-8 relative flex-col gap-8'>
                <div className="relative w-[55vw] mt-14">
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
                        <div 
                            key={index} 
                            className='py-2 text-zinc-300 flex items-center gap-2 justify-between hover:bg-[#343434] hover:px-2 hover:rounded-lg cursor-pointer'
                            onClick={() => {
                                if (result.link) {
                                    const url = result.link.startsWith('http') ? result.link : `http://${result.link}`;
                                    window.open(url, '_blank');
                                }
                            }}
                        >
                            <div className='flex items-center gap-2'>
                                <Image src={result.icon} alt='result icon' height={20} width={18} />
                                <p>{result.name}</p>
                                {result.link !== '' && 
                                    <p className='text-[14px] text-[#a0a0a0]'>{result.link}</p>
                                }
                            </div>
                            <p className='text-[13px] text-[#a0a0a0]'>{convertDate(result.createdAt)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default BookmarkPage